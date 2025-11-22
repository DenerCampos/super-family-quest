import api from "./api";
import type { CouponReader } from "./couponReader";

export const ImageRecognitionService = {
  analyze: async (imageFile: File): Promise<CouponReader> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/image-recognition/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

