// Email service for sending order confirmations and other communications
export const emailService = {
  // Send order confirmation email to user
  sendOrderConfirmation: (orderData, customerData) => {
    try {
      const { orderId, items, totalAmount, shippingAddress } = orderData;
      const { name, email } = customerData;

      // Create email subject
      const subject = encodeURIComponent(`Order Confirmation - FeatherFold #${orderId}`);

      // Create email body with order details
      const emailBody = encodeURIComponent(
        `Dear ${name},\n\n` +
        `Thank you for your order! We're pleased to confirm your purchase from FeatherFold.\n\n` +
        `📦 ORDER DETAILS\n` +
        `================\n` +
        `Order ID: ${orderId}\n` +
        `Order Date: ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}\n\n` +

        `🛍️ ITEMS PURCHASED\n` +
        `==================\n` +
        items.map((item, index) => 
          `${index + 1}. ${item.name}\n` +
          `   Size: ${item.selectedSize || 'Standard'}\n` +
          `   Color: ${item.selectedColor?.name || 'Default'}\n` +
          `   Quantity: ${item.quantity}\n` +
          `   Price: ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}\n`
        ).join('\n') + '\n' +

        `💰 ORDER SUMMARY\n` +
        `================\n` +
        `Subtotal: ₹${totalAmount}\n` +
        `Shipping: FREE\n` +
        `Total Amount: ₹${totalAmount}\n\n` +

        `🏠 SHIPPING ADDRESS\n` +
        `==================\n` +
        `${shippingAddress.street}\n` +
        `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}\n` +
        `Phone: ${shippingAddress.phone}\n\n` +

        `📞 CONTACT US\n` +
        `==============\n` +
        `If you have any questions about your order, please contact us:\n` +
        `Email: officialfeatherfold@gmail.com\n` +
        `Phone: +91 81685 87844\n` +
        `WhatsApp: https://wa.me/918168587844\n\n` +

        `🚀 WHAT'S NEXT?\n` +
        `===============\n` +
        `• You'll receive another email when your order ships\n` +
        `• Track your order status on our website\n` +
        `• Expected delivery: 3-5 business days\n\n` +

        `Thank you for choosing FeatherFold!\n` +
        `We appreciate your business and hope you love your new bedding.\n\n` +

        `Best regards,\n` +
        `The FeatherFold Team\n` +
        `🌟 Premium Cotton Bedding & Home Essentials`
      );

      // Open email client with pre-filled confirmation email
      window.location.href = `mailto:${email}?subject=${subject}&body=${emailBody}`;
      
      return { success: true, message: 'Email client opened for order confirmation' };
      
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send shipping confirmation email
  sendShippingConfirmation: (orderData, trackingNumber) => {
    try {
      const { orderId, customerEmail, customerName } = orderData;

      const subject = encodeURIComponent(`Your FeatherFold Order #${orderId} Has Shipped! 🚚`);
      
      const emailBody = encodeURIComponent(
        `Dear ${customerName},\n\n` +
        `Great news! Your FeatherFold order has been shipped and is on its way to you.\n\n` +
        `📦 SHIPPING DETAILS\n` +
        `==================\n` +
        `Order ID: ${orderId}\n` +
        `Tracking Number: ${trackingNumber}\n` +
        `Shipping Date: ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}\n` +
        `Expected Delivery: 3-5 business days\n\n` +

        `📱 TRACK YOUR ORDER\n` +
        `==================\n` +
        `Track your package: [Tracking Link would go here]\n` +
        `Or visit our website and enter your order ID\n\n` +

        `📞 NEED HELP?\n` +
        `=============\n` +
        `If you have any questions about your delivery:\n` +
        `Email: officialfeatherfold@gmail.com\n` +
        `Phone: +91 81685 87844\n` +
        `WhatsApp: https://wa.me/918168587844\n\n` +

        `Thank you for shopping with FeatherFold!\n\n` +
        `Best regards,\n` +
        `The FeatherFold Team`
      );

      window.location.href = `mailto:${customerEmail}?subject=${subject}&body=${emailBody}`;
      
      return { success: true };
      
    } catch (error) {
      console.error('Error sending shipping confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  // Send order cancellation email
  sendOrderCancellation: (orderData, reason) => {
    try {
      const { orderId, customerEmail, customerName, totalAmount } = orderData;

      const subject = encodeURIComponent(`Order Cancellation Confirmation - FeatherFold #${orderId}`);
      
      const emailBody = encodeURIComponent(
        `Dear ${customerName},\n\n` +
        `Your order #${orderId} has been successfully cancelled.\n\n` +
        `📋 CANCELLATION DETAILS\n` +
        `=======================\n` +
        `Order ID: ${orderId}\n` +
        `Cancellation Date: ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}\n` +
        `Reason: ${reason || 'Customer request'}\n` +
        `Refund Amount: ₹${totalAmount}\n\n` +

        `💰 REFUND INFORMATION\n` +
        `====================\n` +
        `Your refund of ₹${totalAmount} will be processed within 5-7 business days.\n` +
        `The refund will be credited to your original payment method.\n\n` +

        `📞 QUESTIONS?\n` +
        `==============\n` +
        `If you have any questions about the refund:\n` +
        `Email: officialfeatherfold@gmail.com\n` +
        `Phone: +91 81685 87844\n\n` +

        `We're sorry to see you go and hope to serve you again soon!\n\n` +
        `Best regards,\n` +
        `The FeatherFold Team`
      );

      window.location.href = `mailto:${customerEmail}?subject=${subject}&body=${emailBody}`;
      
      return { success: true };
      
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      return { success: false, error: error.message };
    }
  }
};
