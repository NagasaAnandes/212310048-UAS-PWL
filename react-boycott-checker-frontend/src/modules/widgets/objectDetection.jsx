import React, { useRef, useState, useEffect, useCallback } from 'react';
import '@tensorflow/tfjs';
import * as tmImage from "@teachablemachine/image";
import axios from 'axios';

const ObjectDetection = ({ setDetectedProduct, setCategoryProducts, setHighestPrediction }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [model, setModel] = useState(null);
    const [maxPredictions, setMaxPredictions] = useState(0);
    const [predictions, setPredictions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    const loadModel = useCallback(async () => {
        const modelURL = import.meta.env.VITE_BASE_URL + "../../../public/tm-my-image-model/model.json";
        const metadataURL = import.meta.env.VITE_BASE_URL + "../../../public/tm-my-image-model/metadata.json";

        try {
            const loadedModel = await tmImage.load(modelURL, metadataURL);
            setModel(loadedModel);
            setMaxPredictions(loadedModel.getTotalClasses());
            console.log("Model loaded successfully");
        } catch (error) {
            console.error("Error loading model: ", error);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/product/');
            const productsWithImageURL = response.data.map(product => ({
                ...product,
                image: `http://localhost:8000/storage/product/${product.image}`,
                company_image: `http://localhost:8000/storage/company/${product.company_image}`,
                boycott: Boolean(product.boycott),
            }));
            setAllProducts(productsWithImageURL);
        } catch (error) {
            console.error("There was an error fetching the products!", error);
        }
    }, []);

    useEffect(() => {
        loadModel();
        fetchProducts();
    }, [loadModel, fetchProducts]);

    useEffect(() => {
        const video = videoRef.current;
        let stream;

        if (isCameraOn) {
            navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
            }).then(s => {
                stream = s;
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                    requestAnimationFrame(loop);
                };
            });
        } else {
            if (video && video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
                video.srcObject = null;
            }
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOn, model]);

    const loop = async () => {
        if (videoRef.current) {
            await predict();
            requestAnimationFrame(loop);
        }
    };

    const predict = useCallback(async () => {
        if (model && videoRef.current) {
            const prediction = await model.predict(videoRef.current);
            setPredictions(prediction);
            const highestPrediction = prediction.reduce((prev, current) =>
                prev.probability > current.probability ? prev : current
            );
            setHighestPrediction(highestPrediction.className);
            renderPredictions(prediction);
        }
    }, [model, setHighestPrediction]);

    const renderPredictions = (predictions) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px sans-serif';
        ctx.textBaseline = 'top';

        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox || [0, 0, 0, 0];
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = '#00FFFF';
            const textWidth = ctx.measureText(prediction.className).width;
            const textHeight = parseInt(ctx.font, 10);
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
            ctx.fillStyle = '#000000';
            ctx.fillText(`${prediction.className}: ${(prediction.probability * 100).toFixed(2)}%`, x, y);
        });
    };

    const toggleCamera = () => {
        setIsCameraOn(prevState => !prevState);
    };

    const handleFind = useCallback(async () => {
        if (predictions.length > 0) {
            const highestPrediction = predictions.reduce((prev, current) =>
                prev.probability > current.probability ? prev : current
            );
            console.log("Highest prediction:", highestPrediction);
            setHighestPrediction(highestPrediction.className);

            const detectedProduct = allProducts.find(product => product.category.toLowerCase() === highestPrediction.className.toLowerCase());
            if (detectedProduct) {
                detectedProduct.image = `http://localhost:8000/storage/product/${detectedProduct.image}`;
                detectedProduct.company_image = `http://localhost:8000/storage/company/${detectedProduct.company_image}`;
                console.log("Detected Product:", detectedProduct); // Debug log
                setDetectedProduct(detectedProduct);
            } else {
                alert("Produk tidak ditemukan dalam database.");
            }

            try {
                const response = await axios.get(`http://localhost:8000/api/product?category=${highestPrediction.className}`);
                const categoryProductsWithImageURL = response.data.map(product => ({
                    ...product,
                    image: `http://localhost:8000/storage/product/${product.image}`,
                    company_image: `http://localhost:8000/storage/company/${product.company_image}`,
                }));
                setCategoryProducts(categoryProductsWithImageURL);
            } catch (error) {
                console.error("There was an error fetching the products by category!", error);
            }
        } else {
            alert("Tidak ada prediksi yang tersedia");
        }
    }, [predictions, allProducts, setDetectedProduct, setHighestPrediction, setCategoryProducts]);

    return (
        <div className="relative max-w-md py-4">
            <div className="relative w-full h-60 border-4 border-green-500 rounded-lg overflow-hidden">
                <video ref={videoRef} width="640" height="480" className="absolute top-0 left-0 w-full h-full object-cover transform -scale-x-100" />
                <canvas ref={canvasRef} width="640" height="480" className="absolute top-0 left-0 w-full h-full" />
            </div>
            <div className="flex items-center mt-4">
                <div className="">
                    <button onClick={toggleCamera} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        {isCameraOn ? 'Matikan Kamera' : 'Hidupkan Kamera'}
                    </button>
                </div>
            </div>
            {/* <div className="mt-4">
                {predictions.map((prediction, index) => (
                    <div key={index} className="flex items-center">
                        <span>{prediction.className}: {(prediction.probability * 100).toFixed(2)}%</span>
                        <div className="ml-2 bg-gray-200 w-full h-4 rounded">
                            <div className="bg-blue-500 h-4 rounded" style={{ width: `${(prediction.probability * 100).toFixed(2)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div> */}
            <button
                className="bg-blue-600 p-4 rounded-sm text-white w-40 mt-4"
                onClick={handleFind}>
                Search
            </button>
        </div>
    );
};

export default ObjectDetection;
