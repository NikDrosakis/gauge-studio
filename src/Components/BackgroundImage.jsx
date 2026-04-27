// src/Components/BackgroundImage.jsx
import React, { useEffect, useState } from 'react';

export const useBackgroundImage = (imageUrl) => {
    const [loadedImage, setLoadedImage] = useState(null);

    useEffect(() => {
        if (imageUrl && imageUrl !== '') {
            const img = new Image();
            if (imageUrl.startsWith('http')) {
                img.crossOrigin = "Anonymous";
            }
            img.src = imageUrl;
            img.onload = () => setLoadedImage(img);
            img.onerror = () => setLoadedImage(null);
        } else {
            setLoadedImage(null);
        }
    }, [imageUrl]);

    return loadedImage;
};

export const BackgroundImageDiv = ({ imageUrl, imageSize = 100, imageOpacity = 100, children, style = {} }) => {
    const loadedImage = useBackgroundImage(imageUrl);

    const bgStyle = loadedImage ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${imageSize}%`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: imageOpacity / 100,
    } : {};

    return (
        <div style={{ ...style, ...bgStyle, position: 'relative' }}>
            {children}
        </div>
    );
};