import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer } from 'mobx-react';

// import avatarPlaceholder from './placeholder-avatar.png';
import cardPlaceholderImage from './placeholder-image.png';

const ImageCard = ({ user }) => (
  <Card>
    <CardHeader
      title={user.nick}
      subtitle={user.signature}
      avatar={user.avatar}
    />

    <CardMedia
      overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
    >
      <img alt="" src={cardPlaceholderImage} />
    </CardMedia>

    <CardTitle title="Card title" subtitle="Card subtitle" />
    <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
    <CardActions>
      <FlatButton label="Action1" />
      <FlatButton label="Action2" />
    </CardActions>
  </Card>
);

ImageCard.propTypes = {
  user: PropTypes.shape({
    avatar: PropTypes.any,
    nick: PropTypes.string,
    signature: PropTypes.string,
  }),
};

ImageCard.displayName = 'ImageCard';

/* eslint-disable comma-dangle, quotes, quote-props */
ImageCard.defaultProps = {
  user: {
    "avatar": "https://api.adorable.io/avatars/100/jianhua.cheng",
    "nick": "Avatar",
    "signature": "To be or not to be."
  },
};

export default observer(ImageCard);
