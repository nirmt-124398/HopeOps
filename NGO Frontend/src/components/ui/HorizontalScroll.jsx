import React, { useRef } from 'react';

const HorizontalScroll = () => {
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += event.deltaY;
    }
  };

  const images = [
    'https://media.istockphoto.com/id/2083899972/photo/cute-springer-spaniel-mix-dog-outdoors-in-nature-forest-in-long-leash-and-harness.webp?a=1&b=1&s=612x612&w=0&k=20&c=p_e0AvAAhb4RR4VbnqwBJYg6ZO_Lwjkp5ntMvU_wgPU=',
    'https://media.istockphoto.com/id/1885088156/photo/happy-dog-looking-up-at-camera-with-smile.webp?a=1&b=1&s=612x612&w=0&k=20&c=kBstSxF-QIYhdKtTa7NYo5kWLxHMpQbTL8PdxwIW31Y=',
    'https://media.istockphoto.com/id/2184260648/photo/border-collie-with-owner-training-in-a-public-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=iY21-MX7zc-z1xdhJJ7_U-KeQmyaIPfl82Zx9QIuVpI=',
    'https://media.istockphoto.com/id/2191856609/photo/angry-roaring-agressive-jack-russell-terrier-playing-and-biting-his-owner.webp?a=1&b=1&s=612x612&w=0&k=20&c=-jWZNapixBS0Tu__UPOY0y8TZwVOM4wb_fxRoxv65ws=',
    'https://media.istockphoto.com/id/2196087139/photo/dog-gives-paw-to-a-woman-making-high-five-gesture.webp?a=1&b=1&s=612x612&w=0&k=20&c=9JStCy8UAHKmbPZxaWmnbysmXHtUKH_5Iy23XRlFrnA=',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1573435567032-ff5982925350?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1547623542-de3ff5941ddb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <div
      className="horizontal-scroll overflow-x-auto whitespace-nowrap"
      onWheel={handleScroll}
      ref={scrollRef}
    >
      {images.map((url, index) => (
        <div key={index} className="inline-block mx-2">
          <img
            src={url}
            alt={`Animal ${index + 1}`}
            className="w-64 h-64 object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default HorizontalScroll; 