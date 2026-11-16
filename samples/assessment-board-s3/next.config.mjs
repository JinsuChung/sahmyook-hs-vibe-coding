/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이 폴더를 프로젝트의 기준으로 고정한다.
  // (상위 폴더에 다른 package-lock.json이 있으면 Next.js가 그쪽을 기준으로 잘못 잡는 일을 막는다)
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
