const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		proxy: {
			"/api": {
				target: "https://api.foodics.dev/v5", // The API server URL
				changeOrigin: true, // Set to true to handle virtual hosted sites
				pathRewrite: { "^/api": "" }, // Optional: Remove '/api' prefix if needed
				secure: true, // Only if the API server is using HTTPS and has a self-signed certificate
			},
		},
	},
});
