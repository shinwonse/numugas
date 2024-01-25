import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '담장 NUMUGAS 로고';
export const size = {
  height: 630,
  width: 1200,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'white',
          display: 'flex',
          fontSize: 128,
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        담장 NUMUGAS 로고
      </div>
    ),
    {
      ...size,
    }
  );
}
