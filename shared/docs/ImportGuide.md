# Shared Library Import Guide

Use root barrel export for clean tree-shakable imports:

```javascript
import {
  Roles,
  Districts,
  DateHelper,
  GeoHelper,
  FIRValidator,
  FIRMapper
} from '../../shared/index.js';
```
