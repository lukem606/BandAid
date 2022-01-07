import { shallow } from "enzyme";
import App from "../App";

const wrapped = shallow(<App />);

describe("App", () => {
  it("should render correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });

  it("should render a 'Hello world!' <p> element", () => {
    expect(wrapped.find("p").text()).toEqual("Hello world!");
  });
});
