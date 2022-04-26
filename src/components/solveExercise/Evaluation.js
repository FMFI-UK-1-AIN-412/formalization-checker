import React from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  selectEvaluation,
  selectEvalStatus,
  selectEvalError
} from '../../redux/solveExerciseSlice';
import {
    getStringDomainAndPredicates,
} from '../../redux/helpers';


function Evaluation({ evaluation, status, error }) {
  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    content = getMessage(evaluation);
  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        { error }
      </Alert>
    );
  }

  return content;
}

const mapStateToProps = (state, ownProps) => {
  return {
    evaluation: selectEvaluation(state, ownProps.proposition_id),
    status: selectEvalStatus(state, ownProps.proposition_id),
    error: selectEvalError(state, ownProps.proposition_id)
  };
};

export default connect(mapStateToProps)(Evaluation);

const renderStructure = (evaluation, domain, symbols) =>
  <>
    <p>{evaluation}</p>
    <p>{domain}</p>
    <ul className="list-unstyled">
    {symbols.split("\n").filter(i => i.trim() !== "").map((i,key) => {
        return <li key={key}>{i}</li>;
    })}
    </ul>
  </>

const getMessage = (evaluation) => {
  if (evaluation.solutionToFormalization === 'OK'
      && evaluation.formalizationToSolution === 'OK') {
        return (
          <Alert variant="success">
            <b>Riešenie je správne.</b>
          </Alert>
        );
  } else if (evaluation.solutionToFormalization === 'TE'
      || evaluation.formalizationToSolution === 'TE' || evaluation.solutionToFormalization === 'ME'
      || evaluation.formalizationToSolution === 'ME') {
        return (
          <Alert variant="warning">
           <p>Nepodarilo sa automaticky zistiť,
            či je vaše riešenie správne alebo nesprávne.
            Poraďte sa s vyučujúcimi.</p>
          </Alert>
        );
  } else {
      let pom = getStringDomainAndPredicates(evaluation.symbolsFormalizationToSolution, evaluation.domainFormalizationToSolution,
           evaluation.languageContants);
      let domainFormToSol = pom[0];
      let symbolsFormToSol = pom[1];

      pom = getStringDomainAndPredicates(evaluation.symbolsSolutionToFormalization, evaluation.domainSolutionToFormalization,
           evaluation.languageContants);
      let domainSolToForm = pom[0];
      let symbolsSolToForm = pom[1];

      if (evaluation.solutionToFormalization === 'OK'
          && evaluation.formalizationToSolution === 'WA') {
          if (evaluation.iFormalizationSolution !== 'null') {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Existuje štruktúra,
                          v ktorej je hľadaná správna formalizácia pravdivá,
                          ale vaša formalizácia je nepravdivá.</p>
                      { renderStructure(evaluation.m1, domainFormToSol,
                          symbolsFormToSol) }
                  </Alert>
              );
          } else {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Nepodarilo sa však automaticky nájsť kontrapríklad.
                          Ak neviete nájsť chybu, poraďte sa s vyučujúcimi.</p>
                  </Alert>
              );
          }
      } else if (evaluation.solutionToFormalization === 'WA'
          && evaluation.formalizationToSolution === 'OK') {
          if (evaluation.iSolutionToFormalization !== 'null') {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Existuje štruktúra,
                          v ktorej je vaša formalizácia pravdivá,
                          ale hľadaná správna formalizácia je nepravdivá.</p>
                      { renderStructure(evaluation.m2, domainSolToForm,
                          symbolsSolToForm) }
                  </Alert>
              );
          } else {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Nepodarilo sa však automaticky nájsť kontrapríklad.
                          Ak neviete nájsť chybu, poraďte sa s vyučujúcimi.</p>
                  </Alert>
              );
          }
      } else {
          return (
              <Alert variant="danger">
                  <b>Riešenie je nesprávne.</b>
                  <p>Existujú štruktúry,
                      v ktorých je vaša formalizácia pravdivá,
                      ale hľadaná správna formalizácia je nepravdivá, a naopak.</p>
                  { renderStructure(evaluation.m2, domainSolToForm,
                      symbolsSolToForm) }
                  { renderStructure(evaluation.m1, domainFormToSol,
                      symbolsFormToSol) }
              </Alert>
          );
      }

  }
};

