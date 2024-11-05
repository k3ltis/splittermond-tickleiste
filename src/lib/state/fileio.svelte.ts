export const JSON_FILE_SUFFIX = ".splimo.json";

export const extractFileContentAsJSON = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const obj = JSON.parse(event.target?.result as string);
                resolve(obj)
            } catch (e) {
                console.error("error parsing JSON:", e);
                alert("invalid JSON file");
                reject(e)
            }
        };
        reader.onerror = (error) => {
            console.error("error reading file:", error);
            reject(error);
        };
        reader.readAsText(file);
    })
};

export const downloadJSONViaDataURL = (obj: any, fileName: string) => {
    const jsonString = JSON.stringify(obj, null, 2);
    // Create a data URL with the JSON content
    const url = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    // For Safari on iOS, force it to open in a new tab
    a.target = "_blank";
    a.click();
};

export const downloadJSON = async (obj: any, fileName: string = "scene"  + JSON_FILE_SUFFIX) => {
    if (obj) {
        if (!fileName.endsWith(JSON_FILE_SUFFIX)) {
            fileName += JSON_FILE_SUFFIX
        }

        // Create a File from the JSON data
        const fileContent = [JSON.stringify(obj, null, 2)];
        const file = new File(
            fileContent,
            fileName,
            {
                type: "application/json", // MIME type
                lastModified: Date.now()
            }
        );

        // Check if the `navigator.share` API is available and can handle files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            // Use `navigator.share` for mobile sharing options
            try {
                await navigator.share({
                    files: [file],
                    title: "Download JSON",
                    text: "Download JSON file"
                });
            } catch (error) {
                console.error("Error sharing JSON:", error);
                console.info("Try downloading file via data url fallback");
                downloadJSONViaDataURL(obj, fileName);
            }
        } else {
            downloadJSONViaDataURL(obj, fileName);
        }
    } else {
        alert("No data to download");
    }
};
