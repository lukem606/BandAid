import "@testing-library/jest-dom";
import Enzyme, { configure, shallow, mount, render } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

configure({ adapter: new Adapter() });
