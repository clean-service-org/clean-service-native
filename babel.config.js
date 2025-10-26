module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './', // 👈 alias @/ trỏ tới thư mục src
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
