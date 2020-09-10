import config from './config';

export const getSignInEmail = (email, currentLinkUuid) => {
  return {
    from: config.emailAddress,
    to: email,
    subject: 'Password reset',
    text: `Hi. Your registration link is: http://true-cards.com/registration/${currentLinkUuid} If your have a question please sand me email: ${config.emailAddress}`,
    html: `
              <div>
                  <h3>Hi!</h3>
                  <p>Your registration link is: <a href="http://true-cards.com/registration/${currentLinkUuid}">http://true-cards.com/registration/${currentLinkUuid}</a></p>
                  <small>If your have a question please sand me email: <a href="mailto:${config.emailAddress}">${config.emailAddress}</a></small>
              </div>`,
  };
};

export const getForgotPasswordEmail = (userFirstName, userLastName, userEmail, passwordResetConfirmationKey) => {
  return {
    from: config.emailAddress,
    to: userEmail,
    subject: 'Password reset',
    text: `Hi ${userFirstName} ${userLastName}. Your confirmation key is: ${passwordResetConfirmationKey} If your have a question please sand me email: ${config.emailAddress}`,
    html: `
            <div>
                <h3>Hi ${userFirstName} ${userLastName}</h3>
                <p>Your confirmation key is: <b>${passwordResetConfirmationKey}</b></p>
                <small>If your have a question please sand me email: <a href="mailto:${config.emailAddress}">${config.emailAddress}</a></small>
            </div>`,
  };
};
