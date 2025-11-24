import api from "./api";
import type { CouponReader } from "./couponReader";

export const AudioRecognitionService = {
  analyze: async (audioFile: File): Promise<CouponReader> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await api.post('/audio-recognition/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

