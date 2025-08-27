import os
import io
import magic
from typing import Tuple, Optional
from PIL import Image, ImageOps
from app.core.config import settings


class ImageService:
    def __init__(self):
        self.supported_formats = {
            'jpeg': 'JPEG',
            'png': 'PNG',
            'webp': 'WEBP',
            'avif': 'AVIF'
        }
        self.max_file_size = settings.max_file_size
        self.max_megapixels = settings.max_megapixels
    
    def validate_image(self, file_content: bytes, filename: str) -> Tuple[bool, str]:
        """Validate uploaded image file."""
        # Check file size
        if len(file_content) > self.max_file_size:
            return False, f"File size exceeds maximum allowed size of {self.max_file_size // (1024*1024)}MB"
        
        # Check magic bytes for image files
        mime_type = magic.from_buffer(file_content, mime=True)
        if not mime_type.startswith('image/'):
            return False, "File is not a valid image"
        
        # Check megapixels
        try:
            image = Image.open(io.BytesIO(file_content))
            width, height = image.size
            megapixels = (width * height) / (1024 * 1024)
            if megapixels > self.max_megapixels:
                return False, f"Image resolution exceeds maximum allowed megapixels of {self.max_megapixels}"
        except Exception as e:
            return False, f"Failed to process image: {str(e)}"
        
        return True, "Valid image"
    
    def process_image(
        self,
        file_content: bytes,
        width: int,
        height: int,
        fmt: str = 'jpeg',
        quality: int = 85,
        fit: str = 'cover',
        bg_color: str = '#FFFFFF',
        strip_metadata: bool = True
    ) -> bytes:
        """Process image with specified parameters."""
        # Open image
        image = Image.open(io.BytesIO(file_content))
        
        # Handle EXIF orientation
        image = ImageOps.exif_transpose(image)
        
        # Convert CMYK to RGB if necessary
        if image.mode == 'CMYK':
            image = image.convert('RGB')
        
        # Resize image
        resized_image = self._resize_image(image, width, height, fit, bg_color)
        
        # Prepare output format
        output_format = self.supported_formats.get(fmt.lower(), 'JPEG')
        
        # Handle transparency for JPEG
        if output_format == 'JPEG' and resized_image.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', resized_image.size, bg_color)
            if resized_image.mode == 'P':
                resized_image = resized_image.convert('RGBA')
            background.paste(resized_image, mask=resized_image.split()[-1] if resized_image.mode == 'RGBA' else None)
            resized_image = background
        
        # Save to bytes
        output = io.BytesIO()
        
        # Save with appropriate parameters
        if output_format == 'JPEG':
            resized_image.save(output, format=output_format, quality=quality, optimize=True)
        elif output_format == 'PNG':
            resized_image.save(output, format=output_format, optimize=True)
        elif output_format == 'WEBP':
            resized_image.save(output, format=output_format, quality=quality, method=6)
        elif output_format == 'AVIF':
            resized_image.save(output, format=output_format, quality=quality)
        else:
            resized_image.save(output, format=output_format, quality=quality)
        
        return output.getvalue()
    
    def _resize_image(
        self,
        image: Image.Image,
        target_width: int,
        target_height: int,
        fit: str,
        bg_color: str
    ) -> Image.Image:
        """Resize image according to fit mode."""
        original_width, original_height = image.size
        
        if fit == 'stretch':
            # Simple resize to target dimensions
            return image.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        elif fit == 'contain':
            # Fit entire image within target dimensions, maintaining aspect ratio
            ratio = min(target_width / original_width, target_height / original_height)
            new_width = int(original_width * ratio)
            new_height = int(original_height * ratio)
            
            resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Create background
            background = Image.new('RGBA', (target_width, target_height), bg_color)
            
            # Center the resized image
            x = (target_width - new_width) // 2
            y = (target_height - new_height) // 2
            background.paste(resized, (x, y))
            
            return background
        
        elif fit == 'cover':
            # Fill target dimensions, cropping if necessary, maintaining aspect ratio
            ratio = max(target_width / original_width, target_height / original_height)
            new_width = int(original_width * ratio)
            new_height = int(original_height * ratio)
            
            resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Crop to target dimensions
            left = (new_width - target_width) // 2
            top = (new_height - target_height) // 2
            right = left + target_width
            bottom = top + target_height
            
            return resized.crop((left, top, right, bottom))
        
        else:
            # Default to cover
            return self._resize_image(image, target_width, target_height, 'cover', bg_color)


image_service = ImageService()


