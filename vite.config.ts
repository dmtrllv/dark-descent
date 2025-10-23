import path from "path";

export default {
	build: {
		outDir: path.join(import.meta.dirname, "dist", "public"),
		minify: false,
	}
};