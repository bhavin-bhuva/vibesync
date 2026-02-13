import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:vibesync_mobile/shared/services/local_storage_service.dart';
import 'package:vibesync_mobile/core/constants/storage_keys.dart';

class ThemeCubit extends Cubit<ThemeMode> {
  final LocalStorageService _localStorage;

  ThemeCubit(this._localStorage) : super(ThemeMode.system) {
    _loadTheme();
  }

  void _loadTheme() {
    final saved = _localStorage.getString(StorageKeys.themeMode);
    if (saved == 'light') emit(ThemeMode.light);
    else if (saved == 'dark') emit(ThemeMode.dark);
    else emit(ThemeMode.system);
  }

  void updateTheme(ThemeMode mode) {
    emit(mode);
    String val = 'system';
    if (mode == ThemeMode.light) val = 'light';
    else if (mode == ThemeMode.dark) val = 'dark';
    _localStorage.setString(StorageKeys.themeMode, val);
  }
}
