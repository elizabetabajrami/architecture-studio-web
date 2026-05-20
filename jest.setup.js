/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars, react/display-name */
require("@testing-library/jest-dom");

jest.mock("framer-motion", () => {
  const React = require("react");

  const createMotionComponent = (tag) =>
    React.forwardRef(
      (
        {
          animate,
          children,
          initial,
          layoutId,
          transition,
          viewport,
          whileHover,
          whileInView,
          whileTap,
          ...props
        },
        ref,
      ) => React.createElement(tag, { ...props, ref }, children),
    );

  return {
    motion: new Proxy(
      {},
      {
        get: (_target, tag) => createMotionComponent(tag),
      },
    ),
  };
});
