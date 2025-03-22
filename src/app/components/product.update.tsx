import { Button, Form, Input, message, Modal, Upload }from"antd";
import TextArea from "antd/es/input/TextArea";
import CommonUtils from '../../utils/CommonUtils';
import { handleCreateProductAction, handleUpdateProductAction } from "@/action";
import { useEffect, useState } from "react";
import Image from 'next/image';
interface TProps{
  isOpenModalUpdate: boolean;
    setIsOpenModalUpdate: (v: boolean) => void;
    // fetchListProduct: () => void;
    dataUpdate: {
      _id: string,
      title: string,
      description: string,
      image:string
    },
    fetchListProduct: () => void;
}

const ModalUpdate = (props: TProps) => {
    const {isOpenModalUpdate, setIsOpenModalUpdate, dataUpdate, fetchListProduct} = props;
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState("");
    
      const handleOk = () => {
        form.submit()
      };
    
      const handleCancel = () => {
        setIsOpenModalUpdate(false)
      };
      
      const onFinish = async(values: any) => {        
        const updatedData = {
          id: values.id,  
          title: values.title,  
          description: values.description,
          image: values.image 
      };
        const res = await handleUpdateProductAction(updatedData)
        if(res?.message === "Success"){
            form.resetFields(); 
            handleCancel();
            message.success("Update success")
            fetchListProduct();
        }
        
      };
      const handleOnChangImage = async (event: any) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            form.setFieldsValue({ image: base64 });
            setPreviewImage(base64);
        }
      }
      const initialValues = dataUpdate ? {
        id: dataUpdate._id,
        title: dataUpdate.title,
        description: dataUpdate.description,
        image: dataUpdate.image,
      } : { id: '', title: '', description: '', image: '' };
      
      useEffect(() => {
        if (dataUpdate) {
          form.setFieldsValue({
            id: dataUpdate._id,
            title: dataUpdate.title,
            description: dataUpdate.description,
            image: dataUpdate.image
          });
          setPreviewImage(dataUpdate.image);
        }
      }, [dataUpdate]);
    return (
        <>
          <Modal 
        title="Update the product" 
        open={isOpenModalUpdate} 
        onOk={handleOk} 
        onCancel={handleCancel}>
        <Form
          form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 900 }}
            onFinish={onFinish}
            initialValues={initialValues}
          > 
           <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
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
              <input accept="image/*" type="file" onChange={(event) => handleOnChangImage(event)}/>
            </Form.Item>
            {previewImage && (
            <div className="mt-4 flex justify-center">
              {/* <img 
                src={previewImage} 
                alt="Preview" 
                style={{ width: "px", maxHeight: "50px", objectFit: "cover" }} 
              /> */}
              <Image
             src={previewImage} 
              alt="Image description"
              width={50}
              height={50}
            />
            </div>
          )}
         </Form>
        </Modal>
        </>
    );
};

export default ModalUpdate;