import React from 'react';

export default function ShippingReturns() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 uppercase tracking-tight text-center">Shipping & Returns</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-bold font-heading uppercase mb-4 border-b pb-2">Shipping Information</h2>
                <div className="space-y-4 text-gray-600">
                    <p>We offer nationwide shipping across Pakistan.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Standard Shipping:</strong> 3-5 business days (PKR 250)</li>
                        <li><strong>Express Shipping:</strong> 1-2 business days (PKR 500)</li>
                        <li><strong>Free Shipping:</strong> On all orders over PKR 5,000</li>
                    </ul>
                    <p>Cash on Delivery (COD) is available for all orders within Pakistan.</p>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold font-heading uppercase mb-4 border-b pb-2">Return & Exchange Policy</h2>
                <div className="space-y-4 text-gray-600">
                    <p>We want you to be completely satisfied with your purchase. If you are not, we offer returns and exchanges within 14 days of delivery.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Items must be unworn, unwashed, and in their original packaging with all tags attached.</li>
                        <li>Sale items are final and cannot be returned or exchanged unless defective.</li>
                        <li>To initiate a return, please visit our Returns Portal or contact customer support with your order number.</li>
                        <li>Return shipping costs are the responsibility of the customer unless the item received was incorrect or defective.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
