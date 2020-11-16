import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Proposition from './Proposition';
import {
  addNewProposition,
  selectPropositions
} from '../redux/propositionsSlice';

function PropositionsSection(props) {
  const propositions = props.propositions.map((x, i) => (
    <Proposition key={i} i={i} />
  ));

  return (
    <Row>
      <Col>
        <Row>
          <h2>Propositions</h2>
        </Row>
        {propositions}
        <Button
          className="AddNewPropositionButton"
          variant="primary"
          size="lg"
          onClick={() => props.add()}
        >
          Add new proposition
        </Button>
      </Col>
    </Row>
  );
}

const mapStateToProps = (state) => {
  return {
    propositions: selectPropositions(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add: () => dispatch(addNewProposition())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropositionsSection);
