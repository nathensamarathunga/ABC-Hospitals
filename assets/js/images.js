// Image Management System for ABC Hospital
class ImageManager {
    constructor() {
        this.placeholderService = 'https://picsum.photos';
        this.unsplashService = 'https://source.unsplash.com';
        this.imageCache = new Map();
        this.lazyImages = [];
        this.initLazyLoading();
    }

    // Placeholder image URLs for different types
    getPlaceholderImage(type, width = 400, height = 300, seed = null) {
        const seedParam = seed ? `?random=${seed}` : '';
        
        switch(type) {
            case 'doctor':
                return `${this.unsplashService}/${width}x${height}/?doctor,medical,professional${seedParam}`;
            case 'hospital':
                return `${this.unsplashService}/${width}x${height}/?hospital,medical,building${seedParam}`;
            case 'medical-equipment':
                return `${this.unsplashService}/${width}x${height}/?medical,equipment,stethoscope${seedParam}`;
            case 'cardiology':
                return `${this.unsplashService}/${width}x${height}/?heart,cardiology,medical${seedParam}`;
            case 'neurology':
                return `${this.unsplashService}/${width}x${height}/?brain,neurology,medical${seedParam}`;
            case 'pediatrics':
                return `${this.unsplashService}/${width}x${height}/?children,pediatric,medical${seedParam}`;
            case 'orthopedics':
                return `${this.unsplashService}/${width}x${height}/?bones,orthopedic,xray${seedParam}`;
            case 'waiting-room':
                return `${this.unsplashService}/${width}x${height}/?hospital,waiting,room${seedParam}`;
            case 'consultation':
                return `${this.unsplashService}/${width}x${height}/?doctor,patient,consultation${seedParam}`;
            default:
                return `${this.picsum.photos}/${width}/${height}${seedParam}`;
        }
    }

    // Create doctor profile images
    getDoctorImages() {
        return {
            'DOC001': this.getPlaceholderImage('doctor', 200, 200, 1),
            'DOC002': this.getPlaceholderImage('doctor', 200, 200, 2),
            'DOC003': this.getPlaceholderImage('doctor', 200, 200, 3),
            'DOC004': this.getPlaceholderImage('doctor', 200, 200, 4)
        };
    }

    // Create specialization icons
    getSpecializationImages() {
        return {
            'Cardiology': this.getPlaceholderImage('cardiology', 100, 100, 'heart'),
            'Neurology': this.getPlaceholderImage('neurology', 100, 100, 'brain'),
            'Pediatrics': this.getPlaceholderImage('pediatrics', 100, 100, 'child'),
            'Orthopedics': this.getPlaceholderImage('orthopedics', 100, 100, 'bone'),
            'Dermatology': this.getPlaceholderImage('doctor', 100, 100, 'skin'),
            'Psychiatry': this.getPlaceholderImage('doctor', 100, 100, 'mental'),
            'Oncology': this.getPlaceholderImage('doctor', 100, 100, 'cancer'),
            'General Medicine': this.getPlaceholderImage('doctor', 100, 100, 'general')
        };
    }

    // Create hospital gallery images
    getHospitalImages() {
        return [
            {
                url: this.getPlaceholderImage('hospital', 400, 300, 'exterior'),
                title: 'Hospital Exterior',
                description: 'Modern medical facility with state-of-the-art equipment'
            },
            {
                url: this.getPlaceholderImage('waiting-room', 400, 300, 'waiting'),
                title: 'Comfortable Waiting Area',
                description: 'Spacious and comfortable waiting areas for patients'
            },
            {
                url: this.getPlaceholderImage('consultation', 400, 300, 'consult'),
                title: 'Consultation Rooms',
                description: 'Private consultation rooms with modern equipment'
            },
            {
                url: this.getPlaceholderImage('medical-equipment', 400, 300, 'equipment'),
                title: 'Advanced Medical Equipment',
                description: 'Latest medical technology for accurate diagnosis'
            },
            {
                url: this.getPlaceholderImage('hospital', 400, 300, 'corridor'),
                title: 'Hospital Corridors',
                description: 'Clean and well-maintained hospital environment'
            },
            {
                url: this.getPlaceholderImage('hospital', 400, 300, 'reception'),
                title: 'Reception Area',
                description: 'Welcoming reception area with helpful staff'
            }
        ];
    }

    // Initialize lazy loading for images
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.addEventListener('DOMContentLoaded', () => {
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            });
        }
    }

    // Create image element with error handling
    createImage(src, alt, className = '', lazy = true) {
        const img = document.createElement('img');
        
        if (lazy) {
            img.dataset.src = src;
            img.src = this.createPlaceholderDataUrl(100, 100);
            img.className = `lazy ${className}`;
        } else {
            img.src = src;
            img.className = className;
        }
        
        img.alt = alt;
        img.loading = 'lazy';
        
        // Error handling
        img.onerror = () => {
            img.src = this.createPlaceholderDataUrl(200, 200, alt);
        };
        
        return img;
    }

    // Create placeholder data URL
    createPlaceholderDataUrl(width, height, text = 'Image') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        // Background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);
        
        // Text
        ctx.fillStyle = '#999';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, width/2, height/2);
        
        return canvas.toDataURL();
    }

    // Preload important images
    preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            this.imageCache.set(url, img);
        });
    }

    // Optimize image for different screen sizes
    getOptimizedImageUrl(baseUrl, screenWidth) {
        if (screenWidth <= 480) {
            return baseUrl.replace(/\/\d+x\d+/, '/300x200');
        } else if (screenWidth <= 768) {
            return baseUrl.replace(/\/\d+x\d+/, '/500x350');
        } else {
            return baseUrl;
        }
    }
}

// Initialize image manager
const imageManager = new ImageManager();

// Export for global use
window.ImageManager = imageManager;

// Helper functions for different components
window.ImageHelpers = {
    // Add doctor avatar to table row
    addDoctorAvatar: (doctorId, container) => {
        const doctorImages = imageManager.getDoctorImages();
        const img = imageManager.createImage(
            doctorImages[doctorId] || imageManager.getPlaceholderImage('doctor', 80, 80),
            `Doctor ${doctorId}`,
            'doctor-avatar'
        );
        container.appendChild(img);
    },

    // Add specialization icon
    addSpecializationIcon: (specialization, container) => {
        const specializationImages = imageManager.getSpecializationImages();
        const img = imageManager.createImage(
            specializationImages[specialization] || imageManager.getPlaceholderImage('doctor', 60, 60),
            specialization,
            'specialization-icon'
        );
        container.appendChild(img);
    },

    // Create hospital gallery
    createHospitalGallery: (container) => {
        const hospitalImages = imageManager.getHospitalImages();
        const gallery = document.createElement('div');
        gallery.className = 'hospital-gallery';
        
        hospitalImages.forEach(imageData => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = imageManager.createImage(
                imageData.url,
                imageData.title,
                'gallery-image'
            );
            
            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = `
                <h4>${imageData.title}</h4>
                <p>${imageData.description}</p>
            `;
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(overlay);
            gallery.appendChild(galleryItem);
        });
        
        container.appendChild(gallery);
    },

    // Add service icons to navigation cards
    enhanceServiceCards: () => {
        const serviceCards = document.querySelectorAll('.nav-card');
        const serviceTypes = ['cardiology', 'neurology', 'orthopedics', 'pediatrics'];
        
        serviceCards.forEach((card, index) => {
            const iconContainer = card.querySelector('.nav-card-icon');
            if (iconContainer && serviceTypes[index]) {
                const img = imageManager.createImage(
                    imageManager.getPlaceholderImage(serviceTypes[index], 80, 80),
                    serviceTypes[index],
                    'service-icon-large',
                    false
                );
                iconContainer.innerHTML = '';
                iconContainer.appendChild(img);
            }
        });
    }
};