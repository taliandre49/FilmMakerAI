
/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import ChatBox from '../Components/Chatbot/Chatbot';
import '@testing-library/jest-dom';




describe('ChatBox', () => {
  it('should render the chatbot input and button', () => {
    render(<ChatBox   dataRendered={false} onDataRendered={() => {}} />);

    const inputElement = screen.getByPlaceholderText('Ask the AI to modify the shot list...');
    const buttonElement = screen.getByRole('button', { name: /send/i });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });
});
