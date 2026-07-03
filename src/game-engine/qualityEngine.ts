import { dataset } from '../data/dataset';
import type { DatasetMetrics } from '../types';

export function calculateMetrics(
  acceptedIds: string[],
  rejectedIds: string[]
): DatasetMetrics {
  const acceptedImages = dataset.filter((img) => acceptedIds.includes(img.id));
  const rejectedImages = dataset.filter((img) => rejectedIds.includes(img.id));

  // Count correct and incorrect choices
  const goodAccepted = acceptedImages.filter((img) => img.acceptIsCorrect).length;
  const goodRejected = rejectedImages.filter((img) => img.acceptIsCorrect).length;
  const badAccepted = acceptedImages.filter((img) => !img.acceptIsCorrect).length;

  // 1. Noise calculation
  // Each bad image has its own noise impact: blurry_1 (25), blurry_2 (25), low_res (20), meme (15), unrelated (15)
  let noise = 0;
  acceptedImages.forEach((img) => {
    if (!img.acceptIsCorrect) {
      noise += img.quality.noise;
    }
  });
  noise = Math.min(100, Math.max(0, noise));

  // 2. Class Balance (Cat vs Dog)
  const acceptedCats = acceptedImages.filter((img) => img.label === 'cat').length;
  const acceptedDogs = acceptedImages.filter((img) => img.label === 'dog').length;
  const totalAcceptedAnimals = acceptedCats + acceptedDogs;

  let classBalance = 100;
  if (totalAcceptedAnimals > 0) {
    const diff = Math.abs(acceptedCats - acceptedDogs);
    classBalance = Math.round(100 - (diff / totalAcceptedAnimals) * 100);
  }

  // 3. Bias
  // Bias is primarily the inverse of class balance, plus a contribution from unrelated images
  const acceptedUnrelated = acceptedIds.includes('unrelated');
  let bias = 100 - classBalance;
  if (acceptedUnrelated) {
    bias = Math.min(100, bias + 30); // Accepting irrelevant data heavily skews focus
  }

  // 4. Dataset Quality
  // Perfect curation starts at 100.
  // Each bad image accepted decreases quality by 15.
  // Each good image rejected decreases quality by 5.
  let datasetQuality = 100 - badAccepted * 15 - goodRejected * 5;
  datasetQuality = Math.min(100, Math.max(0, datasetQuality));

  // 5. Precision & Recall
  const totalAccepted = acceptedImages.length;
  const precision = totalAccepted > 0 ? Math.round((goodAccepted / totalAccepted) * 100) : 100;
  const recall = Math.round((goodAccepted / 26) * 100); // 26 good images total

  // 6. Estimated Accuracy
  // Max accuracy is 98%, min is 20%.
  // Penalty of -10% per bad image accepted
  // Penalty of -5% per good image rejected
  // Penalty of up to -15% for class imbalance
  let estimatedAccuracy = 98 - badAccepted * 10 - goodRejected * 5 - Math.round(15 * (1 - classBalance / 100));
  estimatedAccuracy = Math.min(98, Math.max(20, estimatedAccuracy));

  return {
    estimatedAccuracy,
    datasetQuality,
    noise,
    bias,
    classBalance,
    precision,
    recall
  };
}
