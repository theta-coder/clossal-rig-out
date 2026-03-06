import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { Loader2, Ruler } from 'lucide-react';

export default function SizeGuide() {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/size-guides`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setGuides(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch size guides:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl mt-[70px]">
            <div className="text-center mb-16">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <Ruler className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 uppercase tracking-tight">Size Guide</h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Use the charts below to help you determine the perfect fit for your Urban Threads apparel.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Loading guides...</p>
                </div>
            ) : guides.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No size guides found.</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {guides.map((guide) => (
                        <div key={guide.id} className="animate-fade-in">
                            <h2 className="text-2xl font-bold font-heading uppercase mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-black"></span>
                                {guide.name}
                            </h2>
                            {guide.description && (
                                <p className="text-gray-600 mb-6 font-light">{guide.description}</p>
                            )}
                            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100 uppercase text-[11px] font-bold tracking-[0.1em] text-gray-500">
                                                {guide.measurements && guide.measurements.length > 0 &&
                                                    Object.keys(guide.measurements[0]).map(key => (
                                                        <th key={key} className="p-5 border-r border-gray-100 last:border-0">{key}</th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guide.measurements && guide.measurements.map((row, idx) => (
                                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-100 last:border-0 hover:bg-black/5 transition-colors`}>
                                                    {Object.keys(guide.measurements[0]).map((key, vIdx) => (
                                                        <td key={vIdx} className={`p-5 text-sm ${key === 'Size' ? 'font-bold text-black' : 'text-gray-600'} border-r border-gray-100 last:border-0 font-medium`}>
                                                            {row[key]}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-20 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">How to measure?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 leading-relaxed">
                    <div>
                        <p className="font-bold text-black mb-2 uppercase tracking-tighter">Chest</p>
                        <p>Measure under your arms, around the fullest part of your chest. Keep the tape level and firm but not tight.</p>
                    </div>
                    <div>
                        <p className="font-bold text-black mb-2 uppercase tracking-tighter">Waist</p>
                        <p>Measure around your natural waistline, keeping the tape slightly loose for comfort.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
