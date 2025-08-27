import pytest
from app.services.image import image_service
import io
from PIL import Image


def create_test_image(width=100, height=100, format='RGB'):
    """Create a test image for testing."""
    img = Image.new(format, (width, height), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    return img_bytes.getvalue()


def test_validate_image_valid():
    """Test image validation with valid image."""
    test_image = create_test_image()
    is_valid, message = image_service.validate_image(test_image, "test.jpg")
    assert is_valid
    assert message == "Valid image"


def test_validate_image_too_large():
    """Test image validation with oversized image."""
    # Create a large image (this would be very large in practice)
    test_image = create_test_image(10000, 10000)
    is_valid, message = image_service.validate_image(test_image, "test.jpg")
    # This might fail due to memory constraints, but should handle gracefully
    assert not is_valid or "megapixels" in message.lower()


def test_process_image_basic():
    """Test basic image processing."""
    test_image = create_test_image(200, 200)
    processed = image_service.process_image(
        test_image,
        width=100,
        height=100,
        fmt='jpeg',
        quality=85
    )
    assert len(processed) > 0
    assert isinstance(processed, bytes)


