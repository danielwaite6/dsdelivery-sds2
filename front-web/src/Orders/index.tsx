import { useEffect, useState } from 'react';
import ProductsList from './ProductsList';
import StepsHeaders from './StepsHeaders';
import './styles.css';
import { Product } from './types';
import { fetchProducts } from '../api';
import OrderLocation from './OrderLocation';


function Orders() {

    const [products, setProducts] = useState<Product[]>([]);
    //console.log(products);
    


    useEffect(()=>{
        ///console.log('Componente Orders iniciou.');
        fetchProducts().then((response) => {
            return setProducts(response.data);
        })
        .catch((err)=>{
            return console.log(JSON.stringify(err));
        });
    }, []);

    return(
        <div className="orders-container">
            <StepsHeaders />
            <ProductsList products={products} />
            <OrderLocation />
        </div>
    )

};
export default Orders;