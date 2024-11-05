import { scene } from "./combatants.svelte";

export let file: File | null = null;

export const extractFileContentAsJSON = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const obj = JSON.parse(event.target?.result as string);
                console.log('parsed JSON:', scene);
                resolve(obj)
            } catch (e) {
                console.error('error parsing JSON:', e);
                alert('invalid JSON file');
                reject(e)
            }
        };
        reader.onerror = (error) => {
            console.error('error reading file:', error);
            reject(error);
        };
        reader.readAsText(file);
    })
};

export const downloadJSONViaDataURL = () => {
    const jsonString = JSON.stringify(scene, null, 2);
    // Create a data URL with the JSON content
    const url = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    // For Safari on iOS, force it to open in a new tab
    a.target = '_blank';
    a.click();
};

export const downloadJSON = async (obj: any) => {
    if (obj) {
        // Create a File from the JSON data with a specified filename
        const file = new File(
            [JSON.stringify(obj, null, 2)], // File content
            'data.json', // Filename
            { type: 'application/json', lastModified: Date.now(), } // MIME type
        );

        // Check if the `navigator.share` API is available and can handle files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            // Use `navigator.share` for mobile sharing options
            try {
                await navigator.share({
                    files: [file],
                    title: 'Download JSON',
                    text: 'Download JSON file'
                });
            } catch (error) {
                console.error('Error sharing JSON:', error);
                console.info("Try downloading file via data url fallback");
                downloadJSONViaDataURL();
            }
        } else {
            downloadJSONViaDataURL();
        }
    } else {
        alert('No data to download');
    }
};
