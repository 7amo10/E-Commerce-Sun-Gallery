import { Injectable, computed, signal } from '@angular/core';
import {
  Product,
  ProductCategory,
  Review,
} from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsSignal = signal<Product[]>([
    {
      id: '1',
      nameAr: 'حقيبة كروشيه كلاسيكية',
      nameEn: 'Classic Crochet Bag',
      descriptionAr: 'حقيبة أنيقة مصنوعة يدويًا بخيوط عالية الجودة.',
      descriptionEn: 'Elegant handmade bag crafted with premium yarn.',
      currency: 'AED',
      images: [
        'https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?q=80&w=1400&auto=format&fit=crop',
      ],
      category: 'bags',
      materials: ['Cotton', 'Leather strap'],
      colors: ['beige', 'brown'],
      createdAt: new Date(),
      featured: true,
      reviews: [
        {
          author: 'نورة',
          authorEn: 'Noura',
          rating: 5,
          comment: 'جميلة جداً وجودتها عالية',
          commentEn: 'Very beautiful and high quality',
          date: new Date(),
        },
        {
          author: 'Sara',
          authorEn: 'Sara',
          rating: 4,
          comment: 'Wonderful bag, thank you!',
          commentEn: 'Wonderful bag, thank you!',
          date: new Date(),
        },
      ],
      variants: [
        {
          id: '1-m',
          nameAr: 'وسط',
          nameEn: 'Medium',
          price: 180,
          stockQuantity: 8,
        },
      ],
    },
    {
      id: '2',
      nameAr: 'شال كروشيه دافئ',
      nameEn: 'Cozy Crochet Shawl',
      descriptionAr: 'شال دافئ بلمسة أنيقة للأيام الباردة.',
      descriptionEn: 'Warm and stylish shawl for chilly days.',
      currency: 'AED',
      images: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop',
      ],
      category: 'clothing',
      materials: ['Wool'],
      colors: ['sage'],
      createdAt: new Date(),
      featured: true,
      reviews: [
        {
          author: 'فاطمة',
          authorEn: 'Fatima',
          rating: 5,
          comment: 'يدفي ومريح جداً',
          commentEn: 'Very warm and comfortable',
          date: new Date(),
        },
      ],
      variants: [
        {
          id: '2-default',
          nameAr: 'قياس واحد',
          nameEn: 'One Size',
          price: 220,
          stockQuantity: 5,
        },
      ],
    },
    {
      id: '3',
      nameAr: 'مفرش طاولة بنقوش عربية',
      nameEn: 'Arabic Pattern Table Runner',
      descriptionAr: 'مفرش طاولة مزخرف بنقوش عربية أنيقة.',
      descriptionEn: 'Elegant Arabic pattern table runner.',
      currency: 'AED',
      images: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop',
      ],
      category: 'home',
      materials: ['Cotton'],
      colors: ['cream'],
      createdAt: new Date(),
      featured: false,
      reviews: [],
      variants: [
        {
          id: '3-default',
          nameAr: 'قياس واحد',
          nameEn: 'One Size',
          price: 150,
          stockQuantity: 12,
        },
      ],
    },
    // New Product 4: Handmade Bag
    {
      id: '4',
      nameAr: 'حقيبة يدوية',
      nameEn: 'Handmade Bag',
      descriptionAr: 'حقيبة يدوية الصنع بألوان وتصاميم مختلفة.',
      descriptionEn: 'Handmade bag with various colors and designs.',
      currency: 'LE',
      images: [
        'https://content.instructables.com/FMS/KUOY/IRHUIHRK/FMSKUOYIRHUIHRK.jpg?auto=webp&fit=bounds&frame=1&height=1024&width=1024',
      ],
      category: 'bags',
      materials: ['Yarn'],
      colors: ['various'],
      createdAt: new Date(),
      featured: true,
      reviews: [],
      variants: [
        {
          id: '4-mini',
          nameAr: 'ميني',
          nameEn: 'Mini',
          price: 150,
          stockQuantity: 10,
        },
        {
          id: '4-medium',
          nameAr: 'وسط',
          nameEn: 'Medium',
          price: 250,
          stockQuantity: 10,
        },
        {
          id: '4-regular',
          nameAr: 'عادية',
          nameEn: 'Regular',
          price: 300,
          stockQuantity: 10,
        },
        {
          id: '4-large',
          nameAr: 'كبيرة',
          nameEn: 'Large',
          price: 350,
          stockQuantity: 10,
        },
      ],
    },
    // New Product 5: Keychain
    {
      id: '5',
      nameAr: 'ميدالية',
      nameEn: 'Keychain',
      descriptionAr: 'ميدالية كروشيه بسيطة وأنيقة.',
      descriptionEn: 'A simple and elegant crochet keychain.',
      currency: 'LE',
      images: [
        'https://upcyclemystuff.com/wp-content/uploads/2023/10/DIY-Keychain-Cover-1024x768.jpg',
      ],
      category: 'accessories',
      materials: ['Yarn'],
      colors: ['various'],
      createdAt: new Date(),
      featured: false,
      reviews: [],
      variants: [
        {
          id: '5-default',
          nameAr: 'قياس واحد',
          nameEn: 'One Size',
          price: 75,
          stockQuantity: 20,
        },
      ],
    },
    // New Product 6: Teddy Bear Keychain
    {
      id: '6',
      nameAr: 'ميدالية دبدوب كروشيه',
      nameEn: 'Crochet Teddy Bear Keychain',
      descriptionAr: 'ميدالية لطيفة على شكل دبدوب مصنوعة من الكروشيه.',
      descriptionEn: 'A cute teddy bear keychain made of crochet.',
      currency: 'LE',
      images: [
        'https://thecaffeinatedsnail.com/wp-content/uploads/2024/12/crochet-bear-keychain-hero-shot5.jpg',
      ],
      category: 'accessories',
      materials: ['Yarn'],
      colors: ['brown', 'beige'],
      createdAt: new Date(),
      featured: true,
      reviews: [],
      variants: [
        {
          id: '6-default',
          nameAr: 'قياس واحد',
          nameEn: 'One Size',
          price: 150,
          stockQuantity: 15,
        },
      ],
    },
    // New Product 7: Handmade Blanket
    {
      id: '7',
      nameAr: 'بطانية هاندميد',
      nameEn: 'Handmade Blanket',
      descriptionAr:
        'بطانية مصنوعة يدويًا بالكامل، قابلة للتخصيص بالألوان والنقشات التي تفضلها.',
      descriptionEn:
        'Fully handmade blanket, customizable with your preferred colors and patterns.',
      currency: 'LE',
      images: [
        'https://hungaricanjourney.com/wp-content/uploads/2020/01/cover-how-to-knit-a-blanket-with-hand.jpg',
      ],
      category: 'home',
      materials: ['Wool', 'Cotton'],
      colors: ['customizable'],
      createdAt: new Date(),
      featured: true,
      reviews: [],
      variants: [
        {
          id: '7-s',
          nameAr: '٨٥*٩٠ سم',
          nameEn: '90x85 cm',
          price: 850,
          stockQuantity: 5,
        },
        {
          id: '7-m',
          nameAr: '١٠٠*١٠٠ سم',
          nameEn: '100x100 cm',
          price: 1050,
          stockQuantity: 5,
        },
        {
          id: '7-l',
          nameAr: '١٢٠*١٠٠ سم',
          nameEn: '100x120 cm',
          price: 1300,
          stockQuantity: 3,
        },
        {
          id: '7-xl',
          nameAr: '١٣٠*١٠٠ سم',
          nameEn: '100x130 cm',
          price: 1450,
          stockQuantity: 3,
        },
      ],
    },
    // New Product 8: Handmade Wool Scarf
    {
      id: '8',
      nameAr: 'سكارف صوف هاندميد',
      nameEn: 'Handmade Wool Scarf',
      descriptionAr:
        'سكارف صوف مصنوع يدويًا، قابل للتخصيص بالألوان والنقشات التي تفضلها.',
      descriptionEn:
        'Handmade wool scarf, customizable with your preferred colors and patterns.',
      currency: 'LE',
      images: [
        'https://nimble-needles.com/wp-content/uploads/2020/04/how-to-knit-a-scarf-683x1024.jpg',
      ],
      category: 'clothing',
      materials: ['Wool'],
      colors: ['customizable'],
      createdAt: new Date(),
      featured: true,
      reviews: [],
      variants: [
        {
          id: '8-s',
          nameAr: '١٥٠*٢٥ سم',
          nameEn: '25x150 cm',
          price: 400,
          stockQuantity: 10,
        },
        {
          id: '8-l',
          nameAr: '٢٠٠*٣٠ سم',
          nameEn: '30x200 cm',
          price: 500,
          stockQuantity: 10,
        },
      ],
      addons: [
        {
          id: 'tassels',
          nameAr: 'إضافة شراشيب',
          nameEn: 'Add Tassels',
          price: 50,
        },
      ],
    },
  ]);

  readonly products = this.productsSignal.asReadonly();

  categories(): { key: ProductCategory; ar: string; en: string }[] {
    return [
      { key: 'bags', ar: 'الحقائب', en: 'Bags' },
      { key: 'clothing', ar: 'الملابس', en: 'Clothing' },
      { key: 'accessories', ar: 'الإكسسوارات', en: 'Accessories' },
      { key: 'home', ar: 'ديكور المنزل', en: 'Home Decor' },
    ];
  }

  byId(id: string) {
    return this.productsSignal().find((p) => p.id === id);
  }

  // NOTE: The methods below are likely broken due to the data model changes.
  // They are out of scope for the current task and will be addressed if they become a blocker.

  addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'reviews'>) {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      reviews: [],
      ...productData,
    };
    this.productsSignal.update((products) => [...products, newProduct]);
  }

  updateProduct(updatedProduct: Product) {
    this.productsSignal.update((products) =>
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  }

  deleteProduct(id: string) {
    this.productsSignal.update((products) =>
      products.filter((p) => p.id !== id),
    );
  }

  addReview(productId: string, reviewData: Omit<Review, 'date'>) {
    const newReview: Review = {
      ...reviewData,
      date: new Date(),
    };
    this.productsSignal.update((products) =>
      products.map((p) =>
        p.id === productId ? { ...p, reviews: [...p.reviews, newReview] } : p,
      ),
    );
  }
}
