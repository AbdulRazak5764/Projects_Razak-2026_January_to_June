import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
          Get In Touch
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-8">Let's talk!</h3>
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                Have a project in mind? I'm available for freelance work or collaboration.
              </p>
              <div className="space-y-4">
                <p><strong>Email:</strong> ankitha@example.com</p>
                <p><strong>LinkedIn:</strong> /in/ankitha</p>
                <p><strong>GitHub:</strong> github.com/ankitha</p>
              </div>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
              <input type="email" placeholder="Your Email" className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
              <textarea placeholder="Your Message" rows={5} className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
