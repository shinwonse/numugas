import axios from 'axios';
import https from 'https';

// SSL DH key too small 오류 해결을 위한 httpsAgent 설정
// gameone.kr 서버가 약한 DH 키를 사용하므로 레거시 cipher 허용
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  ciphers: 'DEFAULT:@SECLEVEL=0',
});

export const axiosInstance = axios.create({
  httpsAgent,
  headers: {
    'User-Agent': 'Mozilla/5.0',
  },
});
