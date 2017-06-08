import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';
import { BeerListContainer } from './components';
import { InputArea, BeerList } from './components';

describe('BeerListContainer', () => {

  it('should render InputArea and BeerList', () => {
    const wrapper = shallow(<BeerListContainer/>);
    expect(wrapper.containsAllMatchingElements([
      <InputArea/>,
      <BeerList/>
    ])).to.equal(true);
  });

  it('should start with an empty list', () => {
    const wrapper = shallow(<BeerListContainer/>);
    expect(wrapper.state('beers')).to.eql([]);
  });

  it('adds items to the list', () => {
    const wrapper = shallow(<BeerListContainer/>);
    const inputArea = wrapper.find(InputArea);
    inputArea.prop('onSubmit')('Sam Adams');
    expect(wrapper.state('beers')).to.eql(['Sam Adams']);
    wrapper.instance().addItem('Monkish');
    wrapper.instance().addItem('Smog City');
    expect(wrapper.state('beers')).to.eql(
      ['Sam Adams', 'Monkish', 'Smog City']);
  });

  it('passes addItem to InputArea', () => {
    const wrapper = shallow(<BeerListContainer/>);
    const inputArea = wrapper.find(InputArea);
    const addItem = wrapper.instance().addItem;
    expect(inputArea.prop('onSubmit')).to.eql(addItem);
  });

});

describe('InputArea', () => {

  it('should contain an input and a button', () => {
    const wrapper = shallow(<InputArea/>);
    expect(wrapper.containsAllMatchingElements([
      <input/>,
      <button>Add</button>
    ])).to.equal(true);
  });

  it('should accept input', () => {
    const wrapper = mount(<InputArea/>);
    const input = wrapper.find('input');
    input.simulate('change', {target: { value: 'Resin' }});
    expect(wrapper.state('text')).to.equal('Resin');
    expect(input.prop('value')).to.equal('Resin');
  });

  it('should call onSubmit when Add is clicked', () => {
    const addItemSpy = spy();
    const wrapper = shallow(<InputArea onSubmit={addItemSpy}/>);
    wrapper.setState({text: 'Casey'});
    const addButton = wrapper.find('button');
    addButton.simulate('click');
    expect(addItemSpy.calledOnce).to.equal(true);
    expect(addItemSpy.calledWith('Casey')).to.equal(true);
  });

  it('should clear text when Add is clicked', () => {
    const addItemSpy = spy();
    const wrapper = shallow(<InputArea onSubmit={addItemSpy}/>);
    wrapper.setState({text: 'Casey'});
    const addButton = wrapper.find('button');
    addButton.simulate('click');
    expect(wrapper.state('text')).to.equal('');
  });

});

describe('BeerList', () => {

  it('should render zero items', () => {
    const wrapper = shallow(<BeerList items={[]}/>);
    expect(wrapper.find('li')).to.have.length(0);
  });

  it('should render undefined items', () => {
    const wrapper = shallow(<BeerList items={undefined}/>);
    expect(wrapper.find('li')).to.have.length(0);
  });

  it('should render some items', () => {
    const items = ['Sam Adams', 'Resin', 'Octoberfest'];
    const wrapper = shallow(<BeerList items={items}/>);
    expect(wrapper.find('li')).to.have.length(3);
  });

});
