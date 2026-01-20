import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, RotateCw, Pen, Eraser, Sliders, Image as ImageIcon, Undo, Redo, ZoomIn, ZoomOut, Crop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = [
    { name: 'Normal', filter: 'none' },
    { name: 'B&W', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(100%)' },
    { name: 'Warm', filter: 'sepia(50%) contrast(110%) brightness(110%)' },
    { name: 'Cool', filter: 'hue-rotate(180deg) opacity(90%)' },
    { name: 'Vintage', filter: 'sepia(40%) contrast(120%) brightness(90%)' },
    { name: 'Cyber', filter: 'contrast(150%) hue-rotate(190deg) saturate(200%)' },
];

const BRUSH_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff', '#000000'];

const ImageEditor = ({ file, onClose, onSave }) => {
    const [image, setImage] = useState(null);
    const [activeTool, setActiveTool] = useState('draw'); // draw, filter, adjust

    // State
    const [rotation, setRotation] = useState(0);
    const [filter, setFilter] = useState(FILTERS[0]);
    const [scale, setScale] = useState(1);

    // Drawing State
    const [brushColor, setBrushColor] = useState('#ef4444');
    const [brushSize, setBrushSize] = useState(4);
    const [isDrawing, setIsDrawing] = useState(false);
    const [paths, setPaths] = useState([]); // { x, y, color, size, type: 'start'|'move'|'end' }[]
    const [historyStep, setHistoryStep] = useState(0); // For undo/redo (future)

    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                setImage(img);
                // Fit to screen initial
                if (containerRef.current) {
                    // logic to fit
                }
            };
        }
    }, [file]);

    // Main Render Loop
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;
        const ctx = canvas.getContext('2d');

        // 1. Setup Canvas Dimensions (Always match Rotated Bounds)
        // If rot=90, width=height
        const rad = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const newWidth = image.width * cos + image.height * sin;
        const newHeight = image.width * sin + image.height * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // 2. Draw Base Image with Filter
        ctx.save();
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        if (filter.filter !== 'none') ctx.filter = filter.filter;
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();

        // 3. Draw Paths (Annotations)
        // NOTE: Paths are stored in coordinates RELATIVE to the UNROTATED image (or rotated?)
        // Simplest: Paths are stored relative to the Current View. 
        // IF we rotate, paths rotate with image? Yes usually.
        // So we apply same transform?
        // Actually, drawing usually happens "On top of the final look".
        // If I rotate, the drawing should rotate too?
        // Let's assume Yes.

        ctx.save();
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        // Move back to top-left of the IMAGE content
        ctx.translate(-image.width / 2, -image.height / 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        paths.forEach((path, i) => {
            if (path.type === 'start') {
                ctx.beginPath();
                ctx.strokeStyle = path.color;
                ctx.lineWidth = path.size;
                ctx.moveTo(path.x, path.y);
            } else if (path.type === 'move') {
                ctx.lineTo(path.x, path.y);
                // Optimization: stroke only occasionally or at end? No, immediate for render loop.
                // But here we are re-rendering ALL on every frame.
                ctx.stroke();
            } else if (path.type === 'end') {
                ctx.closePath();
            }
            // NOTE: This basic loop re-strokes every segment individually which is slow/bad for opacity.
            // Better: Group by 'stroke'.
        });

        // Better Path Rendering:
        // We need to group by strokes.
        // ... logic below in actual render ...

        ctx.restore();

    }, [image, rotation, filter, paths]);

    // Optimized Path Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;
        const ctx = canvas.getContext('2d');

        const rad = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const newWidth = image.width * cos + image.height * sin;
        const newHeight = image.width * sin + image.height * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw Image
        ctx.save();
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        if (filter.filter !== 'none') ctx.filter = filter.filter;
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        // Draw Paths (Relative to Image Top-Left)
        // Context is now at Center. Move to Top-Left of Image.
        ctx.translate(-image.width / 2, -image.height / 2);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let currentPath = null;

        for (let i = 0; i < paths.length; i++) {
            const p = paths[i];
            if (p.type === 'start') {
                ctx.beginPath();
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.size;
                ctx.moveTo(p.x, p.y);
            } else if (p.type === 'move') {
                ctx.lineTo(p.x, p.y);
                if (i === paths.length - 1 || paths[i + 1].type === 'start') {
                    ctx.stroke();
                }
            }
        }
        // Handle unclosed strokes
        if (paths.length > 0 && paths[paths.length - 1].type === 'move') ctx.stroke();

        ctx.restore();

    }, [image, rotation, filter, paths]);

    // Coordinate Mapping for Mouse Events
    const getCoords = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Client Coords
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        // We need these coords Relative to the Unrotated Image Top-Left
        // Reverse the Transform:
        // 1. Translate Center -> Origin
        // 2. Unrotate
        // 3. Translate Origin -> Image TopLeft

        const rad = (rotation * Math.PI) / 180;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Relative to Center
        const dx = x - centerX;
        const dy = y - centerY;

        // Unrotate
        const unrotX = dx * Math.cos(-rad) - dy * Math.sin(-rad);
        const unrotY = dx * Math.sin(-rad) + dy * Math.cos(-rad);

        // Relative to Image Top-Left (Original width/height centered)
        const finalX = unrotX + image.width / 2;
        const finalY = unrotY + image.height / 2;

        return { x: finalX, y: finalY };
    };

    const handleStart = (e) => {
        if (activeTool !== 'draw') return;
        setIsDrawing(true);
        const { x, y } = getCoords(e);
        setPaths(prev => [...prev, { x, y, color: brushColor, size: brushSize, type: 'start' }]);
    };

    const handleMove = (e) => {
        if (!isDrawing || activeTool !== 'draw') return;
        const { x, y } = getCoords(e);
        setPaths(prev => [...prev, { x, y, type: 'move' }]);
    };

    const handleEnd = () => {
        setIsDrawing(false);
    };

    const handleSaveClick = () => {
        canvasRef.current.toBlob((blob) => {
            const newFile = new File([blob], file.name, { type: 'image/png' });
            onSave(newFile);
        }, 'image/png');
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center select-none touch-none">
            {/* Header */}
            <div className="w-full flex items-center justify-between p-4 bg-black border-b border-white/10 z-10">
                <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10">
                    <X className="w-6 h-6" />
                </button>
                <h3 className="text-white font-medium">Image Editor</h3>
                <button onClick={handleSaveClick} className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 px-4 shadow-lg shadow-primary/20">
                    <Check className="w-4 h-4" /> Save
                </button>
            </div>

            {/* Main Workspace */}
            <div
                ref={containerRef}
                className="flex-1 w-full flex items-center justify-center p-4 overflow-hidden relative"
            >
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                    className="max-w-full max-h-full object-contain shadow-2xl border border-white/10 bg-[url('https://transparent-textures.patterns.veliovgroup.com/subtle-grey-patterns/subtle_grey_patterns.png')] bg-white/5"
                    style={{ cursor: activeTool === 'draw' ? 'crosshair' : 'default' }}
                />
            </div>

            {/* Controls */}
            <div className="w-full bg-black/90 border-t border-white/10 backdrop-blur-xl pb-safe">

                {/* Sub-toolbar (Specific controls) */}
                <div className="h-16 flex items-center justify-center border-b border-white/5 px-4 overflow-x-auto custom-scrollbar">
                    {activeTool === 'filter' && (
                        <div className="flex gap-4">
                            {FILTERS.map(f => (
                                <button
                                    key={f.name}
                                    onClick={() => setFilter(f)}
                                    className={`flex flex-col items-center gap-1 min-w-[60px] ${filter.name === f.name ? 'text-primary' : 'text-subtext'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full bg-white/10 border-2 overflow-hidden ${filter.name === f.name ? 'border-primary' : 'border-transparent'}`}>
                                        <div className="w-full h-full bg-gray-500" style={{ filter: f.filter }}></div>
                                    </div>
                                    <span className="text-[10px] whitespace-nowrap">{f.name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTool === 'draw' && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                                {BRUSH_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setBrushColor(c)}
                                        className={`w-6 h-6 rounded-full border-2 ${brushColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'} transition-transform`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                            <div className="h-6 w-px bg-white/10 mx-2" />
                            <input
                                type="range"
                                min="1" max="20"
                                value={brushSize}
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                className="w-24 accent-primary"
                            />
                            <button onClick={() => setPaths([])} className="p-2 text-white/50 hover:text-red-400">
                                <Undo className="w-4 h-4" /> {/* Actually clear all for now */}
                            </button>
                        </div>
                    )}

                    {activeTool === 'adjust' && (
                        <div className="flex gap-6 text-white">
                            <button onClick={() => setRotation(r => (r + 90) % 360)} className="flex flex-col items-center gap-1 hover:text-primary">
                                <RotateCw className="w-6 h-6" />
                                <span className="text-[10px]">Rotate</span>
                            </button>
                            {/* Could add Scale/Crop here later */}
                        </div>
                    )}
                </div>

                {/* Main Toolbar */}
                <div className="flex items-center justify-around p-4 max-w-md mx-auto">
                    <button
                        onClick={() => setActiveTool('draw')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTool === 'draw' ? 'text-primary' : 'text-white/50 hover:text-white'}`}
                    >
                        <Pen className="w-6 h-6" />
                        <span className="text-xs">Draw</span>
                    </button>
                    <button
                        onClick={() => setActiveTool('filter')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTool === 'filter' ? 'text-primary' : 'text-white/50 hover:text-white'}`}
                    >
                        <Sliders className="w-6 h-6" />
                        <span className="text-xs">Filters</span>
                    </button>
                    <button
                        onClick={() => setActiveTool('adjust')}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTool === 'adjust' ? 'text-primary' : 'text-white/50 hover:text-white'}`}
                    >
                        <Crop className="w-6 h-6" />
                        <span className="text-xs">Adjust</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ImageEditor;
