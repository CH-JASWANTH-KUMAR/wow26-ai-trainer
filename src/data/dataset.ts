import type { TrainingImage } from '../types';

export const dataset: TrainingImage[] = [
  // --- GOOD CATS (13 images) ---
  {
    id: 'cat_1',
    src: '/dataset/cat_1.jpg',
    label: 'cat',
    quality: { clarity: 95, relevance: 98, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_2',
    src: '/dataset/cat_2.jpg',
    label: 'cat',
    quality: { clarity: 92, relevance: 95, noise: 6, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_3',
    src: '/dataset/cat_3.jpg',
    label: 'cat',
    quality: { clarity: 96, relevance: 94, noise: 3, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_4',
    src: '/dataset/cat_4.jpg',
    label: 'cat',
    quality: { clarity: 90, relevance: 96, noise: 7, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_5',
    src: '/dataset/cat_5.jpg',
    label: 'cat',
    quality: { clarity: 94, relevance: 92, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_6',
    src: '/dataset/cat_6.jpg',
    label: 'cat',
    quality: { clarity: 91, relevance: 95, noise: 6, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_7',
    src: '/dataset/cat_7.jpg',
    label: 'cat',
    quality: { clarity: 93, relevance: 97, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_8',
    src: '/dataset/cat_8.jpg',
    label: 'cat',
    quality: { clarity: 95, relevance: 91, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_9',
    src: '/dataset/cat_9.jpg',
    label: 'cat',
    quality: { clarity: 92, relevance: 96, noise: 6, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_10',
    src: '/dataset/cat_10.jpg',
    label: 'cat',
    quality: { clarity: 96, relevance: 93, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_11',
    src: '/dataset/cat_11.jpg',
    label: 'cat',
    quality: { clarity: 94, relevance: 95, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_12',
    src: '/dataset/cat_12.jpg',
    label: 'cat',
    quality: { clarity: 93, relevance: 92, noise: 6, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'cat_13',
    src: '/dataset/cat_13.jpg',
    label: 'cat',
    quality: { clarity: 95, relevance: 97, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },

  // --- GOOD DOGS (13 images) ---
  {
    id: 'dog_1',
    src: '/dataset/dog_1.jpg',
    label: 'dog',
    quality: { clarity: 95, relevance: 97, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_2',
    src: '/dataset/dog_2.jpg',
    label: 'dog',
    quality: { clarity: 91, relevance: 95, noise: 6, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_3',
    src: '/dataset/dog_3.jpg',
    label: 'dog',
    quality: { clarity: 93, relevance: 92, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_4',
    src: '/dataset/dog_4.jpg',
    label: 'dog',
    quality: { clarity: 94, relevance: 96, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_5',
    src: '/dataset/dog_5.jpg',
    label: 'dog',
    quality: { clarity: 92, relevance: 94, noise: 7, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_6',
    src: '/dataset/dog_6.jpg',
    label: 'dog',
    quality: { clarity: 95, relevance: 91, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_7',
    src: '/dataset/dog_7.jpg',
    label: 'dog',
    quality: { clarity: 93, relevance: 96, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_8',
    src: '/dataset/dog_8.jpg',
    label: 'dog',
    quality: { clarity: 91, relevance: 95, noise: 6, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_9',
    src: '/dataset/dog_9.jpg',
    label: 'dog',
    quality: { clarity: 94, relevance: 92, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_10',
    src: '/dataset/dog_10.jpg',
    label: 'dog',
    quality: { clarity: 96, relevance: 95, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_11',
    src: '/dataset/dog_11.jpg',
    label: 'dog',
    quality: { clarity: 92, relevance: 93, noise: 7, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_12',
    src: '/dataset/dog_12.jpg',
    label: 'dog',
    quality: { clarity: 93, relevance: 94, noise: 5, biasContribution: 10 },
    acceptIsCorrect: true
  },
  {
    id: 'dog_13',
    src: '/dataset/dog_13.jpg',
    label: 'dog',
    quality: { clarity: 95, relevance: 97, noise: 4, biasContribution: 10 },
    acceptIsCorrect: true
  },

  // --- BLURRY CATS (4 images) ---
  {
    id: 'blurry_cat_1',
    src: '/dataset/blurry_cat_1.jpg',
    label: 'reject',
    quality: { clarity: 25, relevance: 75, noise: 20, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Blurry images increase model noise and reduce validation accuracy.'
  },
  {
    id: 'blurry_cat_2',
    src: '/dataset/blurry_cat_2.jpg',
    label: 'reject',
    quality: { clarity: 30, relevance: 70, noise: 20, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Out-of-focus animals degrade structural features, causing high loss rates.'
  },
  {
    id: 'blurry_cat_3',
    src: '/dataset/blurry_cat_3.jpg',
    label: 'reject',
    quality: { clarity: 20, relevance: 78, noise: 25, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Motion blur prevents the convolutional layers from extracting crisp edges.'
  },
  {
    id: 'blurry_cat_4',
    src: '/dataset/blurry_cat_4.jpg',
    label: 'reject',
    quality: { clarity: 28, relevance: 72, noise: 20, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Poor focus destroys semantic patterns needed for correct classification.'
  },

  // --- BLURRY DOGS (4 images) ---
  {
    id: 'blurry_dog_1',
    src: '/dataset/blurry_dog_1.jpg',
    label: 'reject',
    quality: { clarity: 25, relevance: 75, noise: 20, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Blurry animal data introduces unwanted noise into convolutional nodes.'
  },
  {
    id: 'blurry_dog_2',
    src: '/dataset/blurry_dog_2.jpg',
    label: 'reject',
    quality: { clarity: 30, relevance: 70, noise: 20, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Out-of-focus targets degrade features, causing high validation loss.'
  },
  {
    id: 'blurry_dog_3',
    src: '/dataset/blurry_dog_3.jpg',
    label: 'reject',
    quality: { clarity: 22, relevance: 80, noise: 25, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Heavy camera movement blur introduces high-frequency noise skew.'
  },
  {
    id: 'blurry_dog_4',
    src: '/dataset/blurry_dog_4.jpg',
    label: 'reject',
    quality: { clarity: 27, relevance: 73, noise: 20, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Unclear shapes confuse the hidden layers, preventing accurate classification.'
  },

  // --- NOISE IMAGES (3 images) ---
  {
    id: 'noise_1',
    src: '/dataset/noise_1.jpg',
    label: 'reject',
    quality: { clarity: 15, relevance: 90, noise: 20, biasContribution: 20 },
    acceptIsCorrect: false,
    hint: 'Pixelation degrades resolution, introducing extreme high-frequency noise.'
  },
  {
    id: 'noise_2',
    src: '/dataset/noise_2.jpg',
    label: 'reject',
    quality: { clarity: 45, relevance: 80, noise: 15, biasContribution: 15 },
    acceptIsCorrect: false,
    hint: 'Overexposed lighting washes out edge details, confusing target feature maps.'
  },
  {
    id: 'noise_3',
    src: '/dataset/noise_3.jpg',
    label: 'reject',
    quality: { clarity: 60, relevance: 55, noise: 15, biasContribution: 25 },
    acceptIsCorrect: false,
    hint: 'Severely cropped subjects restrict geometric context, inducing model confusion.'
  },

  // --- BAD DATASET EXAMPLES (4 images) ---
  {
    id: 'bad_1',
    src: '/dataset/bad_1.jpg',
    label: 'reject',
    quality: { clarity: 85, relevance: 35, noise: 15, biasContribution: 30 },
    acceptIsCorrect: false,
    hint: 'Memes and text overlays reduce generalizability and confuse label mapping.'
  },
  {
    id: 'bad_2',
    src: '/dataset/bad_2.jpg',
    label: 'reject',
    quality: { clarity: 95, relevance: 5, noise: 10, biasContribution: 30 },
    acceptIsCorrect: false,
    hint: 'Irrelevant object classes introduce severe bias and corrupt the target validation.'
  },
  {
    id: 'bad_3',
    src: '/dataset/bad_3.jpg',
    label: 'reject',
    quality: { clarity: 92, relevance: 5, noise: 10, biasContribution: 30 },
    acceptIsCorrect: false,
    hint: 'Out-of-domain objects skew dataset weights and compromise model convergence.'
  },
  {
    id: 'bad_4',
    src: '/dataset/bad_4.jpg',
    label: 'reject',
    quality: { clarity: 90, relevance: 30, noise: 15, biasContribution: 30 },
    acceptIsCorrect: false,
    hint: 'Illustrations/drawings do not match real world photos, causing covariate shift.'
  }
];
