import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ProductCard({ product }) {
  if (!product) {
    return <div>Invalid product data</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold">{product.name || "Unnamed Product"}</h3>
      </CardHeader>
      <CardContent>
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name || "Product Image"}
          className="w-full h-40 object-cover"
        />
        <p className="text-gray-500">{product.description || "No description available."}</p>
        <p className="font-bold text-blue-600">
          ${product.price ? product.price.toFixed(2) : "N/A"}
        </p>
      </CardContent>
    </Card>
  );
}
