declare const BUILD_ENV : string | undefined;

export let root_url = "";
if (BUILD_ENV == "dev") {
    root_url = "/api";
} else if (BUILD_ENV == "prod") {
    root_url = "";
} else {
    throw new Error("unknown build "+BUILD_ENV)
}