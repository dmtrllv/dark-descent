import path from "path";

export default {
	build: {
		outDir: path.join(import.meta.dirname, "dist", "public"),
		minify: false,
	},
	plugins: [
		{
			name: "public-reloader",
			enforce: "post",
			handleHotUpdate({ file, server }: any) {
				console.log("reloading json file...");

				server.ws.send({
					type: "full-reload",
					path: "*"
				});

			},
		}
	]
};