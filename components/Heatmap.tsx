import { useState, useEffect } from 'react';

interface DataRow {
    sample_id: string;
    thickness: number[][];
    forces: number[][];
    ground_truth: number[][];
    prediction: number[][];
}

const parseCSVData = async (): Promise<DataRow[]> => {
    const response = await fetch('samples.csv');
    const text = await response.text();
    const rows = text.split('\n').filter((row: string) => row.trim());
    
    // Skip header row and parse data
    return rows.slice(1).map(row => {
        const columns = row.split(',');
        return {
            sample_id: columns[0],
            thickness: JSON.parse(columns[1]), 
            forces: JSON.parse(columns[2]),
            ground_truth: JSON.parse(columns[3]),
            prediction: JSON.parse(columns[4])
        };
    });
};


const HeatmapComponent = () => {
    const [imgSrc, setImgSrc] = useState<string>();
    
    useEffect(() => {
        const loadData = async () => {
            const data = await parseCSVData();
            const randomRow = data[Math.floor(Math.random() * data.length)];
            const prediction = randomRow.prediction;

            // Create canvas and context
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d')!;
            
            // Generate image data from prediction
            const imageData = new ImageData(1024, 1024);
            for(let i = 0; i < 1024*1024*4; i += 4) {
                const pixelIndex = i / 4;
                const y = Math.floor(pixelIndex / 1024);
                const x = pixelIndex % 1024;
                const value = prediction[y][x];
                
                // Convert to grayscale (0-1 -> 0-255)
                const scaled = Math.round(value * 255);
                imageData.data[i] = scaled;     // R
                imageData.data[i+1] = scaled;   // G
                imageData.data[i+2] = scaled;   // B
                imageData.data[i+3] = 255;      // A
            }
            
            ctx.putImageData(imageData, 0, 0);
            setImgSrc(canvas.toDataURL());
        };

        loadData();
    }, []);

    return imgSrc ? (
        <img 
            src={imgSrc} 
            alt="Heatmap" 
            style={{ width: '100%', height: '100%' }}
        />
    ) : null;
};

export default HeatmapComponent;