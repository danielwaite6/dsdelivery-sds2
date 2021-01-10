import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProductsList from './ProductsList';
import StepsHeaders from './StepsHeaders';
import { OrderLocationData, Product } from './types';
import { fetchProducts, saveOrder } from '../api';
import OrderLocation from './OrderLocation';
import OrderSummary from './OrderSummary';
import Footer from '../Footer';
import { checkIsSelected } from './helpers';
import './styles.css';

function Orders() {

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [orderLocation, setOrderLocation] = useState<OrderLocationData>();

    const totalPrice = selectedProducts.reduce((sum, item) => {
        return sum + item.price
    }, 0)

    //console.log(products);
    


    useEffect(()=>{
        ///console.log('Componente Orders iniciou.');
        fetchProducts().then((response) => {
            return setProducts(response.data);
        })
        .catch((err)=>{
            toast.warning('Erro ao listar produtos.');
        });
    }, []);

    /** EXPLICAÇÃO DA FUNÇÃO SOME()
     *   
     *   const number = [1,2,3,4,5]  
     * 
     *   const value = number.some(num => num > 4)
     
         console.log(value); ==> true
     
         Existe na lista algum ('some' do ingles) numero maior do que 4 ??

         Sim. E é o numero 5.
     */

    const handleSelectProduct = (product: Product) => {
        const isAlreadySelected = checkIsSelected(selectedProducts, product);
      
        if (isAlreadySelected) { // Saber se o item ja foi selecionado antes.
          const selected = selectedProducts.filter((item) => item.id !== product.id);
          setSelectedProducts(selected);
        } else {
          setSelectedProducts(previous => [...previous, product]);
        } // [...previous, product] === Copio todo o array e adiciono product nesse array. Spread Operator.
    };

    const handleSubmit = () => {
        const productsIds = selectedProducts.map(({id})  => ({ id }));
        // A const productsIds retorna uma lista de Product[] - ou seja, retorna: [1,5,9,4,8,7,5,4,2]
        const payload = {
          ...orderLocation!,
          products: productsIds
        }
      
        saveOrder(payload).then((response) => {
          toast.error(`Pedido enviado com sucesso !! Nº ${response.data.id}`);
          setSelectedProducts([]);
        })
        .catch(() => {
        toast.warning('Erro ao enviar pedido');
        });
    };


    return(

        <>
            <div className="orders-container">
                <StepsHeaders />
                <ProductsList 
                    products={products}
                    onSelectProduct={handleSelectProduct}
                    selectedProducts={selectedProducts}
                />
                <OrderLocation onChangeLocation={(location) => setOrderLocation(location)} />
                <OrderSummary amount={selectedProducts.length} 
                              totalPrice={totalPrice}
                              onSubmit={handleSubmit}
                />
            </div>
            <Footer />
        </>

        
    )

};
export default Orders;