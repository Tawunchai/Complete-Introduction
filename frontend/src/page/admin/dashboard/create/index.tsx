import React from 'react';
import { Modal, Form, Input, Rate, Button, message } from 'antd';
import { createReview } from '../../../../service/index';
import type { ReviewInterface } from '../../../../interface/IReview';

const { TextArea } = Input;

interface CreateReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const data: ReviewInterface = {
      ...values,
      UserID: 1, // Set UserID เป็น 1 ตลอด
      Date: new Date().toISOString(),
    };
    const res = await createReview(data);
    setLoading(false);
    if (res) {
      message.success('สร้างรีวิวสำเร็จ!');
      form.resetFields();
      onSuccess();
      onClose();
    } else {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  return (
    <Modal
      title="สร้างรีวิว"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ Rating: 0 }}
      >
        <Form.Item
          name="Rating"
          label="ให้คะแนน"
          rules={[{ required: true, message: 'กรุณาให้คะแนน' }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="Comment"
          label="ความคิดเห็น"
          rules={[{ required: true, message: 'กรุณากรอกความคิดเห็น' }]}
        >
          <TextArea rows={3} placeholder="แสดงความคิดเห็น..." maxLength={200} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%', borderRadius: 8 }}
          >
            ส่งรีวิว
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateReviewModal;
