import { Form, Input, message, Modal }from"antd";
import CommonUtils from '../../utils/CommonUtils';
import { handleCreateProductAction } from "@/action";
import { ChangeEvent } from 'react';
interface TProps{
    isOpenModalCreate: boolean;
    setIsOpenModalCreate: (v: boolean) => void;
    fetchListProduct: () => void;
}
interface ProductFormValues {
  title: string;
  description: string;
  image: string; 
}


const ModalCreate = (props: TProps) => {
    const {isOpenModalCreate, setIsOpenModalCreate, fetchListProduct} = props;
    const [form] = Form.useForm();
   
    
      const handleOk = () => {
        form.submit()
      };
    
      const handleCancel = () => {
        setIsOpenModalCreate(false)
      };
      
      const onFinish = async(values: ProductFormValues) => {
        const res = await handleCreateProductAction(values)

        if(res?.message === "Success"){
          fetchListProduct();
            form.resetFields(); 
            handleCancel();
            message.success("Create success")
        }
        
      };
      const handleOnChangImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const data = event.target.files;
        const file = data ? data[0] : null;
        if (file) {
          const  base64 = await CommonUtils.getBase64(file);
  
            form.setFieldsValue({ image: base64 });
        }
      }
    return (

        <>
              <Modal 
        title="Create a new product" 
        open={isOpenModalCreate} 
        onOk={handleOk} 
        onCancel={handleCancel}>
        <Form
          form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 900 }}
            onFinish={onFinish}
          > 
              <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input title!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
               <Input.TextArea showCount maxLength={100} />
            </Form.Item>
            <Form.Item
              name="image"
              label="Image"
               valuePropName="fileList"
            >
              <input type="file" onChange={(event) => handleOnChangImage(event)}/>
            </Form.Item>
           

         </Form>
        </Modal>
        </>
    );
};

export default ModalCreate;