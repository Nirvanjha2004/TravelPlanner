import { toast } from 'react-toastify';

// URLs for free image hosting services
const FREE_IMAGE_HOSTS = [
  { name: 'ImgBB', url: 'https://imgbb.com/' },
  { name: 'Imgur', url: 'https://imgur.com/' },
  { name: 'Postimages', url: 'https://postimages.org/' }
];

// Since Firebase Storage is not available in free tier, we'll implement alternatives
export const uploadImage = async (file) => {
  try {
    // Option 1: If you want to implement a client-side solution,
    // you can use Base64 encoding (not recommended for production/large images)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    
    // Option 2: Show a message asking users to upload to a free image hosting service
    /*
    toast.info(
      <div>
        <p>Please upload your image to one of these free services and copy the direct image URL:</p>
        <ul className="mt-2">
          {FREE_IMAGE_HOSTS.map(host => (
            <li key={host.name} className="mb-1">
              <a 
                href={host.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {host.name}
              </a>
            </li>
          ))}
        </ul>
      </div>,
      { autoClose: 10000 }
    );
    return null;
    */
  } catch (error) {
    console.error("Error processing image:", error);
    toast.error("Error processing image. Please try again.");
    throw error;
  }
};

// Validate image URL
export const validateImageUrl = (url) => {
  // Basic URL validation
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  );
  
  return pattern.test(url);
};

// Convert images from the demo app (Unsplash URLs) to proper image objects
export const processImageUrls = (imageUrls) => {
  return imageUrls.map(url => ({
    url,
    source: url.includes('unsplash.com') ? 'Unsplash' : 'External',
    uploadedAt: new Date().toISOString()
  }));
};
