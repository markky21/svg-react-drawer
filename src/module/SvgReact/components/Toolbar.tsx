import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Divider from '@material-ui/core/Divider';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DrawElement } from '../SvgReact.model';
import { SvgToolbarService } from '../../../services/svg-toolbar.service';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed' as 'fixed',
    maxHeight: '90vh',
    left: '50%',
    bottom: theme.spacing(1),
    transform: 'translateX(-50%)',
    display: 'flex',
  },
  divider: {
    alignSelf: 'stretch',
    height: 'auto',
    margin: theme.spacing(1, 0.5),
  },
}));

const StyledToggleButtonGroup = withStyles(theme => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    padding: theme.spacing(0, 1),
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

interface ToolbarProps {}

const unmount$ = new Subject();
export const Toolbar: React.FC<ToolbarProps> = React.memo(props => {
  const [selectedDrawElement, setSelectedDrawElement] = useState(
    SvgToolbarService.getInstance().selectedDrawElement$.value
  );

  const handleDrawElement = (event: React.MouseEvent<HTMLElement>, drawElement: DrawElement) => {
    SvgToolbarService.getInstance().selectedDrawElement$.next(drawElement);
  };

  useEffect(
    () => {
      SvgToolbarService.getInstance()
        .selectedDrawElement$.pipe(takeUntil(unmount$))
        .subscribe(setSelectedDrawElement);
      return () => unmount$.next();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const classes = useStyles();
  return (
    <div>
      <Paper elevation={3} className={classes.root}>
        <StyledToggleButtonGroup
          size="small"
          value={selectedDrawElement}
          exclusive
          onChange={handleDrawElement}
          aria-label="draw element"
        >
          <ToggleButton value={DrawElement.POLYLINE} aria-label={DrawElement.POLYLINE}>
            POLYLINE
          </ToggleButton>
          <ToggleButton value={DrawElement.CIRCLE} aria-label={DrawElement.CIRCLE}>
            CIRCLE
          </ToggleButton>
          <ToggleButton value={DrawElement.RECT} aria-label={DrawElement.RECT}>
            RECT
          </ToggleButton>
          <ToggleButton value={DrawElement.POLYGON} aria-label={DrawElement.POLYGON}>
            POLYGON
          </ToggleButton>
          <ToggleButton value={DrawElement.ELLIPSE} aria-label={DrawElement.ELLIPSE}>
            ELLIPSE
          </ToggleButton>
          <ToggleButton value={DrawElement.LINE} aria-label={DrawElement.LINE}>
            LINE
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider orientation="vertical" className={classes.divider} />
        <StyledToggleButtonGroup size="small" aria-label="text formatting">
          <ToggleButton value="color" aria-label="color">
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Paper>
    </div>
  );
});
