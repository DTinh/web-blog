import { Button, Form, Input, message, Modal, Upload }from"antd";
import TextArea from "antd/es/input/TextArea";
import CommonUtils from '../../utils/CommonUtils';
import { handleCreateProductAction } from "@/action";
interface TProps{
    isOpenModalCreate: boolean;
    setIsOpenModalCreate: (v: boolean) => void;
    fetchListProduct: () => void;
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
      
      const onFinish = async(values: any) => {
        const res = await handleCreateProductAction(values)

        if(res?.message === "Success"){
          fetchListProduct();
            form.resetFields(); 
            handleCancel();
            message.success("Create success")
        }
        
      };
      const handleOnChangImage = async (event: any) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
  
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