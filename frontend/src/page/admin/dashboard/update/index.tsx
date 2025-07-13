import React from "react";
import { Modal, Form, Input, Rate, Button, message } from "antd";
import { updateReview } from "../../../../service/index";
import type { ReviewInterface } from "../../../../interface/IReview";

const { TextArea } = Input;

interface EditReviewModalProps {
  open: boolean;
  onClose: () => void;
  review: ReviewInterface | null;
  onSuccess: () => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({ open, onClose, review, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (review && open) {
      form.setFieldsValue({
        Rating: review.Rating,
        Comment: review.Comment,
      });
    }
  }, [review, open, form]);

  const handleFinish = async (values: any) => {
    if (!review?.ID) return;
    setLoading(true);
    const res = await updateReview(review.ID, values);
    setLoading(false);
    if (res) {
      message.success("อัปเดตรีวิวสำเร็จ!");
      form.resetFields();
      onSuccess();
    } else {
      message.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <Modal
      title="แก้ไขรีวิว"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="Rating"
          label="ให้คะแนน"
          rules={[{ required: true, message: "กรุณาให้คะแนน" }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="Comment"
          label="ความคิดเห็น"
          rules={[{ required: true, message: "กรุณากรอกความคิดเห็น" }]}
        >
          <TextArea rows={3} placeholder="แสดงความคิดเห็น..." maxLength={200} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%", borderRadius: 8 }}
          >
            อัปเดตรีวิว
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditReviewModal;
