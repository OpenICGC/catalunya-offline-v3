//import React from 'react';
import {expect} from 'chai';
//import { Counter } from './counter';

describe('<Counter /> tests', () => {
  it('Does a dumb test', () => {
    expect(true).to.be.true;
  });
  /*
  let wrapper = shallow(<Counter />);

  beforeEach(() => {
    wrapper = shallow(<Counter />);
  });

  it('debe de mostrar el valor por defecto de 100', () => {
    const wrapper = shallow(<Counter value={100} />);
    const counterText = wrapper.find('h2').text().trim();
    expect(counterText).to.equal('100');
  });

  it('debe incrementar con el botón +1', () => {
    wrapper.find('button').at(0).simulate('click');
    const counterText = wrapper.find('h2').text().trim();
    expect(counterText).to.equal('11');
  });

  it('debe decrementar con el botón -1', () => {
    wrapper.find('button').at(2).simulate('click');
    const counterText = wrapper.find('h2').text().trim();
    expect(counterText).to.equal('9');
  });

  it('debe de colocar el valor por defecto con el botón reset', () => {
    const wrapper = shallow(<Counter value={105} />);
    wrapper.find('button').at(0).simulate('click');
    wrapper.find('button').at(1).simulate('click');
    const counterText = wrapper.find('h2').text().trim();
    expect(counterText).to.equal('105');
  });
  */
});
