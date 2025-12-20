export const SERVICE_BANNERS: Record<string, any> = {
  Standard: require('@/assets/images/service-banners/standard-banner.jpg'),
  'Deep Clean': require('@/assets/images/service-banners/deep-clean-banner.jpg'),
  'A/C Cleaning': require('@/assets/images/service-banners/ac-cleaning-banner.jpg'),
  'Post Construction': require('@/assets/images/service-banners/post-construction-banner.jpg'),
  'Home Moving': require('@/assets/images/service-banners/home-moving-banner.jpg'),
  'Post Party': require('@/assets/images/service-banners/post-party-banner.jpg'),
  'Child Care': require('@/assets/images/service-banners/child-care-banner.jpg'),
  'Industrial Cleaning': require('@/assets/images/service-banners/industrial-cleaning-banner.jpg'),
};

export const getServiceBanner = (serviceName: string) => {
  return (
    SERVICE_BANNERS[serviceName] ||
    require('@/assets/images/service-banners/standard-banner.jpg')
  );
};
