module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
        "react/jsx-key": "off",
        "react/jsx-no-duplicate-props": "off",
    },
}
