
export type UserRole = 'OWNER' | 'WALKER' | 'PROFESSIONAL' | 'STORE_OWNER' | 'ADMIN';
export type ServiceType = 'WALKING' | 'PENSION' | 'TRAINING' | 'STORES' | 'ARTICLES' | 'VETERINARY' | 'INSURANCE' | 'SHOP' | 'ADOPTION' | 'GROOMING' | 'COMMUNITY' | 'BREEDS';

export type PromotionTier = 'FREE' | 'MONTHLY' | 'ANNUAL';
export type AddonTier = 'NONE' | 'MONTHLY_CUBE' | 'ANNUAL_CUBE';

export interface Deal {
  id: string;
  title: string;
  description: string;
  images: string[]; // Up to 3
  businessName: string;
  businessId: string;
  category: ServiceType;
  city: string;
}

// Fix: Added missing Collaborator interface
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Fix: Added missing BreedInfo interface
export interface BreedInfo {
  id: string;
  name: string;
  englishName: string;
  intelligence: number;
  shedding: number;
  energy: number;
  origin: string;
  image: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone?: string;
  city: string;
  address?: string;
  idNumber?: string; // T.Z or H.P
  isComplete: boolean;
  registrationDate: string;
  trialStartDate: string; 
  lastPaymentDate?: string;
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
  promotionTier: PromotionTier;
  userRole: UserRole;
  subscriptionTier?: 'MONTHLY' | 'ANNUAL';
  businessId?: string;
  businessName?: string;
  hasPromotionsAddon?: boolean;
  promotionsAddonTier?: AddonTier;
  bankDetails?: {
    bankName: string;
    bankCode: string;
    branchNumber: string;
    accountNumber: string;
    accountHolderName: string;
  };
  savedProfessionals?: SavedProfessional[];
  documents?: DogDocument[];
  collaborators?: Collaborator[];
  marketingProfile?: MarketingProfile;
  isBiometricEnabled?: boolean;
}

export interface MarketingProfile {
  photos: string[];
  description: string;
  recommendations: { author: string, text: string, rating: number, date: string }[];
  expertTips: string[];
  promotionStatus: 'NONE' | 'BASIC' | 'PREMIUM';
  customDisplayText?: string;
  deals?: Deal[]; // Up to 5 deals
}

export interface SavedProfessional {
  id: string;
  name: string;
  type: ServiceType;
  phone: string;
}

export interface DogDocument {
  id: string;
  title: string;
  date: string;
  type: 'MEDICAL' | 'LICENSE' | 'TAX_DOC' | 'OTHER';
  fileData: string;
}

export interface Booking {
  id: string;
  walkerId: string;
  ownerName: string;
  dogId: string;
  dogName: string;
  serviceType: ServiceType;
  startTime: Date;
  totalAmount: number;
  walkerEarnings: number;
  platformFee: number;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface Walker {
  id: string;
  businessId: string;
  name: string;
  image?: string;
  rating: number;
  city: string;
  pricePerHour: number;
  pricePerNight?: number;
  pricePerSession?: number;
  services: ServiceType[];
  bio: string;
  isAvailable: boolean;
  reviewsCount: number;
  experienceYears: number;
  isPromoted: boolean;
  marketingProfile?: MarketingProfile;
  registrationDate?: string;
  role: UserRole;
}

export interface DogMedia {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  date: string;
}

export interface DogAlbum {
  id: string;
  title: string;
  month: string;
  year: number;
  aiSummary: string;
  mediaIds: string[];
  createdAt: string;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  notes: string;
  profileImage?: string;
  media: DogMedia[];
  albums?: DogAlbum[];
  licenseNumber?: string;
  vetName?: string;
}

export interface DogReminder {
  id: string;
  dogId: string;
  title: string;
  date: string;
  time: string;
  category: 'HEALTH' | 'VACCINE' | 'HYGIENE' | 'GENERAL';
  icon: string;
  alertTimeMinutes: number;
  professionalId?: string;
  note?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  readTime: string;
}

export interface DogVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  externalLink?: string;
}

export interface CallLog {
  id: string;
  businessId: string;
  timestamp: string;
  duration: number;
}

export interface LocationState {
  city: string;
  lat?: number;
  lng?: number;
  isManual: boolean;
}

export interface PetStore {
  name: string;
  address: string;
  phone: string;
}

export type VetClinic = PetStore;
export type AdoptionCenter = PetStore;
export type DogTrainer = PetStore;
export type Groomer = PetStore;

export interface InsurancePlan {
  id: string;
  company: string;
  name: string;
  pricePerMonth: number;
  coverage: string[];
  logo: string;
}

export interface CommunityAnswer {
  id: string;
  userId: string;
  userName: string;
  userRole?: UserRole;
  content: string;
  timestamp: string;
  isExpert?: boolean;
}

export interface CommunityQuestion {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  timestamp: string;
  answers: CommunityAnswer[];
}
