import React from 'react';

export default function SizeGuide() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 uppercase tracking-tight text-center">Size Guide</h1>
            <p className="text-gray-500 mb-12 text-center text-lg">Use the charts below to help you determine the perfect fit for your Urban Threads apparel.</p>

            <div className="mb-12">
                <h2 className="text-2xl font-bold font-heading uppercase mb-6 border-b pb-2">Men's Tops (Shirts, T-Shirts, Hoodies)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 uppercase text-sm tracking-wide">
                                <th className="p-4 border">Size</th>
                                <th className="p-4 border">Chest (Inches)</th>
                                <th className="p-4 border">Waist (Inches)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-4 border font-bold">Small (S)</td><td className="p-4 border">36 - 38</td><td className="p-4 border">29 - 31</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border font-bold">Medium (M)</td><td className="p-4 border">39 - 41</td><td className="p-4 border">32 - 34</td></tr>
                            <tr><td className="p-4 border font-bold">Large (L)</td><td className="p-4 border">42 - 44</td><td className="p-4 border">35 - 37</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border font-bold">X-Large (XL)</td><td className="p-4 border">45 - 47</td><td className="p-4 border">38 - 40</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold font-heading uppercase mb-6 border-b pb-2">Men's Bottoms (Jeans, Trousers, Shorts)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 uppercase text-sm tracking-wide">
                                <th className="p-4 border">Size (Waist)</th>
                                <th className="p-4 border">Inseam (Regular)</th>
                                <th className="p-4 border">Inseam (Long)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-4 border font-bold">30</td><td className="p-4 border">32"</td><td className="p-4 border">34"</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border font-bold">32</td><td className="p-4 border">32"</td><td className="p-4 border">34"</td></tr>
                            <tr><td className="p-4 border font-bold">34</td><td className="p-4 border">32"</td><td className="p-4 border">34"</td></tr>
                            <tr className="bg-gray-50"><td className="p-4 border font-bold">36</td><td className="p-4 border">32"</td><td className="p-4 border">34"</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
