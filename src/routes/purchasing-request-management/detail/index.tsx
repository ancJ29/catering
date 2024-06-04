import { useParams } from "react-router-dom";

const PurchasingRequestDetail = () => {
  const { purchaseRequestId } = useParams();
  return (
    <>Purchasing Request Detail {purchaseRequestId}</>
  );
};

export default PurchasingRequestDetail;
